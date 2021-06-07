const EventEmitter = require('events');
const Sentry = require('@sentry/node');
const { inspect } = require('util');
const EventSource = require('eventsource');
const handleLogLine = require('../../../worker/processors/logs/handleLogLine');

const SSERegex = /\d+-\d+-\d+T\d+:\d+:\d+ \d+\.\d+ INF (.+)/;
class LoggingObject extends EventEmitter {
  constructor(server,) {
    super();
    this.server = server;

  }

  async init() {
    const config = this.server.config[0];
    const { serverSentEvents } = config;

    if (!serverSentEvents) {
      this.queue = sails.helpers.getQueueObject('logs');
      this.queue.on('global:completed', this.handleCompletedJob.bind(this));
      this.queue.on('global:failed', this.handleFailedJob);
      this.queue.on('global:error', this.handleError);

      await this.queue.add({ serverId: this.server.id },
        {
          attempts: 1,
          repeat: {
            jobId: this.server.id,
            every: config.slowMode ? sails.config.custom.logCheckIntervalSlowMode : sails.config.custom.logCheckInterval,
          }
        });
    } else {
      this.eventSource = new EventSource(`http://${this.server.ip}:${this.server.webPort}/sse/`);
      this.eventSource.addEventListener('logLine', data => {
        try {
          console.log(data);
          const parsed = JSON.parse(data.data);
          const messageMatch = SSERegex.exec(parsed.msg);
          if (messageMatch[1]) {
            parsed.msg = messageMatch[1];
          }
          const log = handleLogLine(parsed);
          console.log(log);
          this.emit(log.type, log.data);
        } catch (error) {
          sails.log.error(error.message);
        }

      });
      this.eventSource.onerror = e => {
        sails.log.warn(e);
      };
      this.eventSource.onopen = () => {
        sails.log.debug(`Opened a SSE channel for server ${this.server.id}`);
      };
    }
  }

  async handleError(error) {
    sails.log.error(inspect(error));
    Sentry.captureException(error);
  }

  async handleFailedJob(jobId, error) {
    sails.log.error(inspect(error));
    Sentry.captureException(error);
  }

  async handleCompletedJob(job, result) {
    result = sails.helpers.safeJsonParse(result, []);

    // This handler fires every time a job completes
    // We have to check if the completed job was meant for this LoggingObject
    if (result.server.id !== this.server.id) {
      // Not for this server
      return;
    }

    if (result.setInactive) {
      // Cannot call this from the worker
      // Failedhandler returns this prop to signal that the server should be set to inactive
      return await sails.helpers.meta.setServerInactive(this.server.id);
    }

    if (result.logs.length) {
      sails.log.debug(`Got ${result.logs.length} logs for server ${this.server.id}`);
    }

    for (const log of result.logs) {
      log.data.server = this.server;
      this.emit(log.type, log.data);
    }
    // This return is not really used
    // The purpose for this is to use it in tests
    // to help assert that 'nothing happened'
    return result.logs;
  }

  async destroy() {
    this.removeAllListeners();
    return;
  }
}

module.exports = LoggingObject;
