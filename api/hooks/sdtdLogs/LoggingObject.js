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
