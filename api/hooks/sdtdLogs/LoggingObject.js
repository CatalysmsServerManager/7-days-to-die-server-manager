const EventEmitter = require('events');
const Sentry = require('@sentry/node');
const { inspect } = require('util');

const defaultIntervalMs = 2000;
const slowModeIntervalms = 300000;

class LoggingObject extends EventEmitter {
  constructor(server,) {
    super();
    this.server = server;

    this.queue = sails.helpers.getQueueObject('logs');


    this.queue.on('global:completed', this.handleCompletedJob.bind(this));
    this.queue.on('global:failed', this.handleFailedJob);
    this.queue.on('global:error', this.handleError);
    this.queue.on('global:cleaned', function (jobs, type) {
      throw new Error('Shouldnt have cleaned! TODO: Remove this if youre sure it doesnt happen anymore :)');
    });
  }

  async init(ms = sails.config.custom.logCheckInterval) {
    // TODO: make sure this is not doubled if server is in slowmode
    await this.queue.add({ serverId: this.server.id },
      {
        repeat: {
          jobId: this.server.id,
          every: ms,
        }
      });
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
    // TODO: Emit things so sails hooks in main process pick em up
    if (result.length) {
      sails.log.debug('Got some logs! yay');
      console.log(result);
    }
  }

  async destroy() {
    await this.stop();
    this.removeAllListeners();
    return;
  }

  async stop() {
    await this.queue.removeRepeatable({
      jobId: this.server.id,
      every: sails.config.custom.logCheckInterval,
    });
    // Make sure the job is also deleted if the server is in slowmode
    await this.queue.removeRepeatable({
      jobId: this.server.id,
      every: slowModeIntervalms,
    });
  }
}

module.exports = LoggingObject;
