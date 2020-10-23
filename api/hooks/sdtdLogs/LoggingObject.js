const EventEmitter = require('events');
const enrich = require('./enrichEventData');

const { inspect } = require('util');

const defaultIntervalMs = 2000;
const slowModeIntervalms = 300000;

class LoggingObject extends EventEmitter {
  constructor(
    server,
    intervalTime = defaultIntervalMs
  ) {
    super();
    this.serverId = server.id;

    this.active = true;
    this.lastLogLine = 0;
    this.queue = sails.helpers.getQueueObject('logs');
    this.intervalTime = intervalTime;
    this.requestInterval;
    this.failed = false;
    this.slowmode = false;
    // Keep track of how many times we receive an empty response.
    // If we get too many empty responses, we force a recheck of lastLogLine
    this.emptyResponses = 0;
    // Set this to true to view detailed info about logs for a server. (protip: use discord bot eval command to set this to true in production instances)
    this.debug = true;
    this.queue.on('global:completed', this.handleCompletedJob.bind(this));
    this.queue.on('global:failed', this.handleFailedJob.bind(this));
    this.queue.on('global:error', this.handleError.bind(this));
    this.queue.on('global:cleaned', function (jobs, type) {
      sails.log.debug('Cleaned %s %s jobs', jobs.length, type);
    });
  }

  async addFetchJob() {
    if (!this.active) {
      return;
    }
    sails.log.debug(`Adding new fetch job for server ${this.serverId} - last log line: ${this.lastLogLine}`);
    this.queue.add(
      {
        serverId: this.serverId,
        lastLogLine: this.lastLogLine
      },
      {
        timeout: 5000,
        attempts: 0,
        delay: this.intervalTime
      }
    );
  };

  async init(ms = sails.config.custom.logCheckInterval) {
    if (!ms) {
      ms = 3000;
    }

    this.active = true;
    this.intervalTime = ms;

    await this.addFetchJob();
  }

  async handleError(error) {
    sails.log.error(inspect(error));
  }

  async handleFailedJob(jobId, err) {
    const job = await this.queue.getJob(jobId);

    if (!job || !job.data || !job.data.serverId) {
      sails.log.debug(`handleFailedJob - Ignoring bad job since theres no data: ${inspect(job)}`);
      return;
    }

    if (job.data.serverId.toString() !== this.serverId.toString()) {
      // not one of ours
      return;
    }

    // A job failed with reason `err`!
    sails.log.error(`Queue error: ${inspect(err)}`);
    await this._failedHandler();
    return;
  }

  async handleCompletedJob(job, result) {
    if (typeof result === 'string') {
      result = JSON.parse(result);
    }

    if (!result) {
      sails.log.debug(`handleCompletedJob - Ignoring bad job since theres no data: ${inspect(job)}`);
      return;
    }


    // eslint-disable-next-line eqeqeq
    if (result.serverId.toString() !== this.serverId.toString()) {
      // not one of ours
      return;
    }

    const isStalled = result.lastLogLine === this.lastLogLine;
    if (isStalled) {
      this.emptyResponses++;
      if (this.emptyResponses > 15) {
        // haven't found any responses in a while, so reset to 0 and try again from scratch
        await this.setLastLogLine(0);
        this.emptyResponses = 0;
      }
    } else if (result.lastLogLine) {
      // save the log line we found
      await this.setLastLogLine(result.lastLogLine);
      this.emptyResponses = 0;
    }

    for (const newLog of result.logs) {
      let enrichedLog = newLog;
      if (newLog.type !== 'logLine') {
        try {
          enrichedLog = await enrich.enrichEventData(newLog);
        } catch (e) {
          sails.log.warn('Error trying to enrich a log line, this should be OK to fail...');
          sails.log.error(e);
        }
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

    if (this.failed) {
      await this.setFailedToZero();
      await this.setLastLogLine(0);
      this.failed = false;
    }

    // If the server is in slowmode and we receive data again, this shows the server is back online
    if (this.slowmode) {
      this.slowmode = false;
      await this.stop();
      await this.init();
      return;
    }

    await sails.helpers.redis.set(`sdtdserver:${this.serverId}:sdtdLogs:lastSuccess`, Date.now());
    await this.addFetchJob();
  }

  async destroy() {
    await this.stop();
    this.removeAllListeners();
    return;
  }

  async stop() {
    this.active = false;
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

  async setLastLogLine(lastLogLine) {
    await sails.helpers.redis.set(
      `sdtdserver:${this.serverId}:sdtdLogs:lastLogLine`,
      lastLogLine
    );
    this.lastLogLine = lastLogLine || 0;
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
    if (counter > 500) {
      let prettyLastSuccess = new Date(lastSuccess);

      if (!this.slowmode) {
        sails.log.info(
          `SdtdLogs - Server ${this.serverId
          } has failed ${counter} times. Changing interval time. Server was last successful on ${prettyLastSuccess.toLocaleDateString()} ${prettyLastSuccess.toLocaleTimeString()}`
        );
        this.slowmode = true;
        await this.stop();
        await this.init(slowModeIntervalms);
        return;
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
