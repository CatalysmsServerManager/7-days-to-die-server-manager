const SdtdApi = require('7daystodie-api-wrapper');
const EventEmitter = require('events');
const handleLogLine = require('./handleLogLine');
const enrichEventData = require('./enrichEventData');
const Bull = require('bull');
const path = require('path');
const {
  inspect
} = require('util');

const defaultIntervalMs = 2000;
const slowModeIntervalms = 300000;

class LoggingObject extends EventEmitter {

  constructor(ip, port, authName, authToken, serverId, intervalTime = defaultIntervalMs) {
    super();
    this.server = {
      id: serverId,
      ip: ip,
      port: port,
      adminUser: authName,
      adminToken: authToken,
    };

    this.queue = new Bull(`sdtdserver:${serverId}:logs`, process.env.REDISSTRING);
    this.intervalTime = intervalTime;
    this.requestInterval;
    this.failed = false;
    // Keep track of how many times we receive an empty response.
    // If we get too many empty responses, we force a recheck of lastLogLine 
    this.emptyResponses = 0;
    // Set this to true to view detailed info about logs for a server. (protip: use discord bot eval command to set this to true in production instances)
    this.debug = true;
    this.queue.process(path.join(__dirname, 'logProcessor.js'));
    this.init();
    this.queue.on('completed', (job, result) => this.handleCompletedJob(job, result, this));
    this.queue.on('failed', (job, err) => this.handleFailedJob(job, err, this));
    this.queue.on('error', this.handleError);
  }

  async init(ms = 3000) {
    sails.log.debug('START INIT');
    try {
      await this.setLastLogLine();
    } catch (error) {
      // Fail silently
    }
    await this.queue.add({
      server: this.server,
      lastLogLine: this.lastLogLine
    }, {
      repeat: {
        every: ms,
      },
      removeOnFail: 50,
      removeOnComplete: 200,
      timeout: 4000,
    });
    sails.log.debug('END INIT');
  }

  async handleError(error) {
    sails.log.error(inspect(error))
  }

  async handleFailedJob(job, err, loggingObject) {
    // A job failed with reason `err`!
    sails.log.error(`Queue error: ${inspect(err)}`);
    await loggingObject._failedHandler();
    return;
  }

  async handleCompletedJob(job, result, loggingObject) {
    sails.log.debug(`Completed a job with ID ${job.id} - Found ${result.logs.length} new logs`);

    if (result.logs.length === 0) {
      this.emptyResponses++
    }

    if (this.emptyResponses > 5) {
      await this.setLastLogLine();
    }

    for (const newLog of result.logs) {
      const data = await enrichEventData(newLog);
      loggingObject.emit(newLog.type, data);
    }

    // If the server is in slowmode and we receive data again, this shows the server is back online
    if (this.slowmode) {
      this.slowmode = false;
      await this.stop();
      await this.init();
    }

    await this.setFailedToZero();
  }

  async destroy() {
    await this.stop();
    this.removeAllListeners();
    return;
  }


  async stop() {
    await this.queue.empty();
    const jobs = await this.queue.getRepeatableJobs();
    for (const job of jobs) {
      sails.log.debug(inspect(job))
      await this.queue.removeRepeatableByKey(job.key)
    }
    sails.log.debug('END STOP');
    return;
  }

  _toggleDebug() {
    this.debug = !this.debug;
  }

  async setFailedToZero() {
    await sails.helpers.redis.set(`sdtdserver:${this.server.id}:sdtdLogs:failedCounter`, 0);
  }

  async setLastLogLine() {
    const webUIUpdate = await SdtdApi.getWebUIUpdates(this.server);
    const lastLogLine = parseInt(webUIUpdate.newlogs) + 1;
    await sails.helpers.redis.set(`sdtdserver:${this.server.id}:sdtdLogs:lastLogLine`, lastLogLine);
    this.emptyResponses = 0;
    return lastLogLine
  }

  // Called when a request to a server fails for whatever reason
  async _failedHandler() {
    const threeDaysInMs = 1000 * 60 * 60 * 24 * 3;
    this.failed = true;
    let counter = await sails.helpers.redis.incr(`sdtdserver:${this.server.id}:sdtdLogs:failedCounter`);
    let lastSuccess = await sails.helpers.redis.get(`sdtdserver:${this.server.id}:sdtdLogs:lastSuccess`);
    lastSuccess = parseInt(lastSuccess);
    if (counter > 100) {
      let prettyLastSuccess = new Date(lastSuccess);

      if (!this.slowmode) {
        sails.log.info(`SdtdLogs - Server ${this.server.id} has failed ${counter} times. Changing interval time. Server was last successful on ${prettyLastSuccess.toLocaleDateString()} ${prettyLastSuccess.toLocaleTimeString()}`);
        this.slowmode = true;
        await this.stop();
        await this.init(300000);
      }

      if (lastSuccess + threeDaysInMs < Date.now()) {
        sails.log.warn(`SdtdLogs - server ${this.server.id} has not responded in over 3 days, setting to inactive`);
        await sails.helpers.meta.setServerInactive(this.server.id);
      }
    }

  }

}

module.exports = LoggingObject
