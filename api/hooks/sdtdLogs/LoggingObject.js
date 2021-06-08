const EventEmitter = require('events');
const Sentry = require('@sentry/node');
const { inspect } = require('util');
const EventSource = require('eventsource');
const handleLogLine = require('../../../worker/processors/logs/handleLogLine');
const enrich = require('../../../worker/processors/logs/enrichEventData');
const LastLogLine = require('../../../worker/processors/logs/redisVariables/lastLogLine');

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
      await LastLogLine.set(this.server.id, 0);
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
      this.startSSE();
    }
  }

  startSSE() {
    this.eventSource = new EventSource(`http://${this.server.ip}:${this.server.webPort}/sse/`);
    this.eventSource.addEventListener('logLine', async data => {
      try {
        const parsed = JSON.parse(data.data);
        const messageMatch = SSERegex.exec(parsed.msg);
        if (messageMatch && messageMatch[1]) {
          parsed.msg = messageMatch[1];
        }
        const log = handleLogLine(parsed);
        if (log) {
          await this.handleMessage(log);
        }
      } catch (error) {
        sails.log.error(error.stack);
      }

    });
    this.eventSource.onerror = e => {
      sails.log.warn(e);
    };
    this.eventSource.onopen = () => {
      sails.log.debug(`Opened a SSE channel for server ${this.server.id}`);
    };
  }

  stopSSE() {
    if (!this.eventSource) {
      return;
    }

    this.eventSource.close();
  }

  async handleMessage(newLog) {
    let enrichedLog = newLog;
    enrichedLog.server = this.server;

    if (newLog.type !== 'logLine') {
      try {
        // Add some more data to the log line if possible
        enrichedLog = await enrich.enrichEventData(enrichedLog);
      } catch (e) {
        sails.log.warn('Error trying to enrich a log line, this should be OK to fail...');
        sails.log.error(e);
      }
      sails.helpers.getQueueObject('hooks').add({ type: 'logLine', data: enrichedLog.data, server: this.server });
    }

    sails.log.debug(
      `Log line for server ${this.server.id} - ${newLog.type} - ${newLog.data.msg}`
    );

    sails.helpers.getQueueObject('hooks').add(enrichedLog);
    sails.helpers.getQueueObject('customNotifications').add(enrichedLog);


    if (newLog.type === 'chatMessage') {
      sails.helpers.getQueueObject('sdtdCommands').add(enrichedLog);
    }

    this.emit(enrichedLog.type, enrichedLog.data);

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


    const promises = result.logs.map(l => this.handleMessage(l));

    await Promise.all(promises);
    // This return is not really used
    // The purpose for this is to use it in tests
    // to help assert that 'nothing happened'
    return result.logs;
  }

  async destroy() {
    this.removeAllListeners();
    this.stopSSE();
    return;
  }
}

module.exports = LoggingObject;
