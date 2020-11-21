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

    if (result.setInactive) {
      return await sails.helpers.meta.setServerInactive(this.serverId);
    }

    // TODO: Emit things so sails hooks in main process pick em up
    if (result.length) {
      sails.log.debug('Got some logs! yay');
      console.log(result);
    }
  }

  async destroy() {
    this.removeAllListeners();
    return;
  }
}

module.exports = LoggingObject;
