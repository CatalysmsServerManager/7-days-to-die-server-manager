const SdtdApi = require("7daystodie-api-wrapper");
const EventEmitter = require("events");
const enrichData = require("./enrichEventData");

const { inspect } = require("util");

const defaultIntervalMs = 2000;
const slowModeIntervalms = 300000;

class LoggingObject extends EventEmitter {
  constructor(
    ip,
    port,
    authName,
    authToken,
    serverId,
    intervalTime = defaultIntervalMs
  ) {
    super();
    this.serverId = serverId;

    this.active = true;
    this.queue = sails.helpers.getQueueObject('logs');
    this.intervalTime = intervalTime;
    this.requestInterval;
    this.failed = false;
    // Keep track of how many times we receive an empty response.
    // If we get too many empty responses, we force a recheck of lastLogLine
    this.emptyResponses = 0;
    // Set this to true to view detailed info about logs for a server. (protip: use discord bot eval command to set this to true in production instances)
    this.debug = true;
    this.init();
    this.queue.on("global:completed", this.handleCompletedJob.bind(this));
    this.queue.on("global:failed", this.handleFailedJob.bind(this));
    this.queue.on("global:error", this.handleError.bind(this));
    this.queue.on("global:cleaned", function (jobs, type) {
      sails.log.debug("Cleaned %s %s jobs", jobs.length, type);
    });
  }

  async addFetchJob() {
    sails.log.debug("Adding new fetch job")
    this.queue.add(
      {
        serverId: this.serverId,
        lastLogLine: this.lastLogLine // FIXME - currently ignored
      },
      {
        timeout: 5000,
        removeOnComplete: 100,
        removeOnFail: 100,
        attempts: 0,
        delay: this.intervalTime
      }
    );
  };

  async init(ms = sails.config.custom.logCheckInterval) {

    if (!ms) {
      ms = 3000;
    }

    this.intervalTime = ms;

    // Make sure there are no lingering jobs
    await this.stop();

    try {
      await this.setLastLogLine();
    } catch (error) {
      // Fail silently
    }

    await this.addFetchJob()
  }

  async handleError(error) {
    sails.log.error(inspect(error));
  }

  async handleFailedJob(job, err) {
    // A job failed with reason `err`!
    sails.log.error(`Queue error: ${inspect(err)}`);
    await this._failedHandler();
    return;
  }

  async handleCompletedJob(job, result) {
    if (typeof result === 'string') {
      result = JSON.parse(result);
    }


    if (result.serverId.toString() !== this.serverId) {
      // not one of ours
      return;
    }
    if (result.logs.length === 0) {
      this.emptyResponses++;
    }

    if (this.emptyResponses > 5) {
      await this.setLastLogLine();
    }

    for (const newLog of result.logs) {
      let enrichedLog = newLog;
      if (newLog.type !== "logLine") {
        enrichedLog = await enrichData(newLog);
        // We still want to emit these events as log lines aswell (for modules like hooks, discord notifications)
        this.emit('logLine', enrichedLog.data);
      }
      if (this.debug) {
        sails.log.debug(
          `Log line for server ${this.serverId} - ${newLog.type} - ${newLog.data.msg}`
        );
      }

      this.emit(newLog.type, enrichedLog.data);
    }

    await this.setFailedToZero();
    // If the server is in slowmode and we receive data again, this shows the server is back online
    if (this.slowmode) {
      this.slowmode = false;
      await this.stop();
      await this.init();
      return
    }

    await this.addFetchJob();
  }

  async destroy() {
    await this.stop();
    this.removeAllListeners();
    return;
  }

  async stop() {
    clearInterval(this.interval);
    return;
  }

  _toggleDebug() {
    this.debug = !this.debug;
  }

  async setFailedToZero() {
    await sails.helpers.redis.set(
      `sdtdserver:${this.serverId}:sdtdLogs:failedCounter`,
      0
    );
  }

  async setLastLogLine() {
    const server = await SdtdServer.findOne(this.serverId)
    const webUIUpdate = await SdtdApi.getWebUIUpdates(SdtdServer.getAPIConfig(server));
    const lastLogLine = parseInt(webUIUpdate.newlogs) + 1;
    await sails.helpers.redis.set(
      `sdtdserver:${this.serverId}:sdtdLogs:lastLogLine`,
      lastLogLine
    );
    this.emptyResponses = 0;
    return lastLogLine;
  }

  // Called when a request to a server fails for whatever reason
  async _failedHandler() {
    const threeDaysInMs = 1000 * 60 * 60 * 24 * 3;
    this.failed = true;
    let counter = await sails.helpers.redis.incr(
      `sdtdserver:${this.serverId}:sdtdLogs:failedCounter`
    );
    let lastSuccess = await sails.helpers.redis.get(
      `sdtdserver:${this.serverId}:sdtdLogs:lastSuccess`
    );
    lastSuccess = parseInt(lastSuccess);
    if (counter > 100) {
      let prettyLastSuccess = new Date(lastSuccess);

      if (!this.slowmode) {
        sails.log.info(
          `SdtdLogs - Server ${
          this.serverId
          } has failed ${counter} times. Changing interval time. Server was last successful on ${prettyLastSuccess.toLocaleDateString()} ${prettyLastSuccess.toLocaleTimeString()}`
        );
        this.slowmode = true;
        await this.stop();
        await this.init(300000);
        return
      }

      if (lastSuccess + threeDaysInMs < Date.now()) {
        sails.log.warn(
          `SdtdLogs - server ${this.serverId} has not responded in over 3 days, setting to inactive`
        );
        await sails.helpers.meta.setServerInactive(this.serverId);
      }
    }
    await this.addFetchJob();
  }
}

module.exports = LoggingObject;
