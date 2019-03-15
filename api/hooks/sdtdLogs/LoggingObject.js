const SdtdApi = require('7daystodie-api-wrapper');
const EventEmitter = require('events');
const handleLogLine = require('./handleLogLine');
const enrichEventData = require('./enrichEventData');

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
    // Keep track of how many times we receive an empty response.
    // If we get too many empty responses, we force a recheck of lastLogLine 
    this.emptyResponses = 0;
    this.lastLogLine;
    // Keeps track of wheter a request is happening already. This is to block the interval from queueing massive amounts of requests.
    this.handlingRequest = false;
    this.lastMemUpdate = Date.now();
    // Set this to true to view detailed info about logs for a server. (protip: use discord bot eval command to set this to true in production instances)
    this.debug = true;
    this.init();
  }

  async init() {
    await this._getLatestLogLine();

    // If the server does not have a value for lastSuccess, we initialize it to now.
    let lastSuccess = await sails.helpers.redis.get(`sdtdserver:${this.server.id}:sdtdLogs:lastSuccess`);
    if (_.isNull(lastSuccess)) {
      await sails.helpers.redis.set(`sdtdserver:${this.server.id}:sdtdLogs:lastSuccess`, Date.now());
    }

    // Get new logs in a timed interval
    this.requestInterval = setInterval(this._intervalFunction.bind(this), this.intervalTime);
  }

  destroy() {
    this.stop();
    this.removeAllListeners();
    return;
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
      await this._failedHandler();
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
      await sails.helpers.redis.set(`sdtdserver:${this.server.id}:sdtdLogs:lastSuccess`, Date.now());
      await sails.helpers.redis.del(`sdtdserver:${this.server.id}:sdtdLogs:failedCounter`);
    } catch (error) {
      await this._failedHandler();
      newLogs.entries = [];
    }
    if (this.debug && newLogs.entries.length > 0) {
      sails.log.debug(`SdtdLogs - DEBUG MESSAGE - found ${newLogs.entries.length} new logs for server ${this.server.id}. Latest line: ${this.lastLogLine} First line ${newLogs.entries[0].time}, last line ${newLogs.entries[newLogs.entries.length - 1].time}`);
    }

    if (newLogs.entries.length === 0) {
      this.emptyResponses++;

      if (this.emptyResponses > 5) {
        this._getLatestLogLine();
        if (this.debug) {
          sails.log.debug(`SdtdLogs - DEBUG MESSAGE - server ${this.server.id} --- Too many empty responses received, rechecking log line #. Current lastLogLine: ${this.lastLogLine}`);
        }
        this.emptyResponses = 0;
      }
    }

    _.each(newLogs.entries, async line => {
      if (this.debug) {
        sails.log.verbose(`SdtdLogs - DEBUG MESSAGE - server ${this.server.id} --- ${line.msg}`);
      }

      let parsedLogLine = handleLogLine(line);
      if (!_.isUndefined(parsedLogLine)) {
        parsedLogLine.server = this.server;
        try {
          parsedLogLine.data = await enrichEventData(parsedLogLine);
        } catch (error) {
          sails.log.error(error);
        }

        if (!this._checkDuplicateMemUpdate(parsedLogLine, line)) {
          this.emit(parsedLogLine.type, parsedLogLine.data);
        }
      }
    });

    this.lastLogLine = newLogs.lastLine;
    this.handlingRequest = false;
  }

  // Called when a request to a server fails for whatever reason
  async _failedHandler() {
    const oneDayInMs = 1000 * 60 * 60 * 24;
    this.failed = true;
    let counter = await sails.helpers.redis.incr(`sdtdserver:${this.server.id}:sdtdLogs:failedCounter`);
    let lastSuccess = await sails.helpers.redis.get(`sdtdserver:${this.server.id}:sdtdLogs:lastSuccess`);
    lastSuccess = parseInt(lastSuccess);
    if (counter > 100) {
      let prettyLastSuccess = new Date(lastSuccess);
      sails.log.info(`SdtdLogs - Server ${this.server.id} has failed ${counter} times. Changing interval time. Server was last successful on ${prettyLastSuccess.toLocaleDateString()} ${prettyLastSuccess.toLocaleTimeString()}`);
      this.stop();
      
      if (lastSuccess + oneDayInMs < Date.now()) {
        sails.log.warn(`SdtdLogs - server ${this.server.id} has not responded in over 24 hours, setting to inactive`);
        await sails.helpers.meta.setServerInactive(this.server.id);
      } else {
        this.intervalTime = 60000;
        this.init();
      }
    }

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
