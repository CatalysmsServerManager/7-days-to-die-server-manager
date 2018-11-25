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

    if (this.handlingRequest) {
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
    this.handlingRequest = false;
    if (this.debug && newLogs.entries.length > 0) {
      sails.log.debug(`SdtdLogs - DEBUG MESSAGE - found ${newLogs.entries.length} new logs for server ${this.server.id}. Latest line: ${this.lastLogLine} First line ${newLogs.entries[0].time}, last line ${newLogs.entries[newLogs.entries.length - 1].time}`);
    }

    _.each(newLogs.entries, async line => {

      if (this.debug) {
        sails.log.verbose(`SdtdLogs - DEBUG MESSAGE - server ${this.server.id} --- ${line.msg}`)
      }

      let parsedLogLine = handleLogLine(line);
      if (parsedLogLine) {
        if (!await this._checkDuplicateMemUpdate(parsedLogLine, line)) {
          this.emit(parsedLogLine.type, parsedLogLine.data);
        }
      }
    });

    this.lastLogLine = newLogs.lastLine;
  }


  async _checkDuplicateMemUpdate(parsedLogLine, line) {
    if (parsedLogLine.type === "memUpdate") {
      let currentDate = Date.now();
      let lastMemUpdate = await sails.helpers.redis.get(`server:${this.server.id}:lastMemUpdate`);
      lastMemUpdate = new Date(parseInt(lastMemUpdate));
      lastMemUpdate = lastMemUpdate.valueOf();
      await sails.helpers.redis.set(`server:${this.server.id}:lastMemUpdate`, currentDate);
      if (currentDate < lastMemUpdate + 25000) {

        if (this.debug) {
          sails.log.debug(`SdtdLogs - DEBUG MESSAGE - Detected memUpdate happening too soon for server ${this.server.id} - discarding event at ${line.date} ${line.time}`);
        }

        return true;
      } else {
        return false;
      }

    } else {
      return false;
    }
  }

}

module.exports = LoggingObject;
