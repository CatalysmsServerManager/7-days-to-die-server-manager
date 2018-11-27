const SdtdApi = require('7daystodie-api-wrapper');
const EventEmitter = require('events');
const handleLogLine = require('./handleLogLine');

class LoggingObject extends EventEmitter {

  constructor(ip, port, authName, authToken, serverId, intervalTime = 2000) {
    super();
    this.server = {
      id: serverId,
      ip: ip,
      port: port,
      adminUser: authName,
      adminToken: authToken,
    };
    this.intervalTime = intervalTime;
    this.requestInterval;
    this.failed = false;
    this.lastLogLine;
    // Keeps track of wheter a request is happening already. This is to block the interval from queueing massive amounts of requests.
    this.handlingRequest = false;
    this.lastMemUpdate = Date.now();
    // Set this to true to view detailed info about logs for a server. (protip: use discord bot eval command to set this to true in production instances)
    this.debug = false;
    this.init();
  }

  async init() {

    await this._getLatestLogLine();

    // Get new logs in a timed interval
    this.requestInterval = setInterval(this._intervalFunction.bind(this), this.intervalTime);
  }


  stop() {
    clearInterval(this.requestInterval);
  }

  _toggleDebug() {
    this.debug = !this.debug;
  }

  // Used for testing purposes
  _sendMockMemUpdate() {
    let event = {
      type: 'memUpdate',
      data: {
        fps: '34.55',
        heap: '847.3MB',
        chunks: '198',
        zombies: '1',
        entities: '2',
        players: '1',
        items: '3',
        rss: '1946.6MB',
        uptime: '758.965'
      }
    };

    if (!this._checkDuplicateMemUpdate(event, {
        date: "n/a",
        time: "n/a"
      })) {
      this.emit(event.type, event.data);
    }
  }

  async _getLatestLogLine() {
    try {
      const webUIUpdate = await SdtdApi.getWebUIUpdates(this.server);

      if (this.debug) {
        sails.log.debug(`SdtdLogs - DEBUG MESSAGE - Latest log line for server ${this.server.id} is ${webUIUpdate.newlogs}`);
      }

      this.lastLogLine = parseInt(webUIUpdate.newlogs) + 1;

    } catch (error) {
      this.failed = true;
      if (this.debug) {
        sails.log.debug(`Error when getting latest log line for server with ip ${this.server.ip} - ${error}`);
      }

      return 0;
    }
  }

  async _intervalFunction() {
    let newLogs = {};

    if (this.handlingRequest && this.debug) {
      sails.log.debug(`SdtdLogs - DEBUG MESSAGE - Waiting for a request already, skipping this one.`);
      return;
    }

    if (this.failed) {
      await this._getLatestLogLine();
    }



    try {
      this.handlingRequest = true;
      newLogs = await SdtdApi.getLog(this.server, this.lastLogLine);
      this.lastLogLine = this.lastLogLine + newLogs.entries.length;
      this.failed = false;
    } catch (error) {
      this.failed = true;
      newLogs.entries = [];
    }
    if (this.debug && newLogs.entries.length > 0) {
      sails.log.debug(`SdtdLogs - DEBUG MESSAGE - found ${newLogs.entries.length} new logs for server ${this.server.id}. Latest line: ${this.lastLogLine} First line ${newLogs.entries[0].time}, last line ${newLogs.entries[newLogs.entries.length - 1].time}`);
    }

    _.each(newLogs.entries, async line => {

      if (this.debug) {
        sails.log.verbose(`SdtdLogs - DEBUG MESSAGE - server ${this.server.id} --- ${line.msg}`)
      }

      let parsedLogLine = handleLogLine(line);
      if (parsedLogLine) {

        if (!this._checkDuplicateMemUpdate(parsedLogLine, line)) {
          this.emit(parsedLogLine.type, parsedLogLine.data);
        }
      }
    });

    this.lastLogLine = newLogs.lastLine;
    this.handlingRequest = false;
  }


  _checkDuplicateMemUpdate(parsedLogLine, line) {
    if (parsedLogLine.type === "memUpdate") {
      let currentDate = Date.now();
      let lastMemUpdate = this.lastMemUpdate;
      if (currentDate < lastMemUpdate + 25000) {
        
        if (this.debug) {
          sails.log.debug(`SdtdLogs - DEBUG MESSAGE - Detected memUpdate happening too soon for server ${this.server.id} - discarding event at ${line.date} ${line.time}`);
        }
        
        return true;
      } else {
        this.lastMemUpdate = currentDate;
        return false;
      }

    } else {
      return false;
    }
  }

}

module.exports = LoggingObject;
