const EventEmitter = require('events');
const Sentry = require('@sentry/node');
const { inspect } = require('util');

class LoggingObject extends EventEmitter {
  constructor(server,) {
    super();
    this.server = server;

    this.queue = sails.helpers.getQueueObject('logs');


    this.queue.on('global:completed', this.handleCompletedJob.bind(this));
    this.queue.on('global:failed', this.handleFailedJob);
    this.queue.on('global:error', this.handleError);
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
    if (result.setInactive) {
      // Cannot call this from the worker
      // Failedhandler signals
      return await sails.helpers.meta.setServerInactive(this.server.id);
    }

    if (result.length) {
      sails.log.debug(`Got ${result.length} logs for server ${this.server.id}`);
    }

    for (const log of result) {
      log.data.server = this.server;
      this.emit(log.type, log.data);
    }
  }

  async destroy() {
    this.removeAllListeners();
    return;
  }
}

module.exports = LoggingObject;
