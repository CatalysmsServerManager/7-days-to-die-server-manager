const LoggingObject = require('../LoggingObject');
const LastLogLine = require('../../../../worker/processors/logs/redisVariables/lastLogLine');

class SdtdPolling extends LoggingObject {
  constructor(server) {
    super(server);
  }
  async start() {
    const { config } = this.server;
    await LastLogLine.set(this.server.id, 0);
    this.queue = sails.helpers.getQueueObject('logs');
    this.listener = this.handleCompletedJob.bind(this);
    this.queue.on('global:completed', this.listener);

    await this.queue.add({ serverId: this.server.id },
      {
        attempts: 1,
        repeat: {
          jobId: this.server.id,
          every: config.slowMode ? sails.config.custom.logCheckIntervalSlowMode : sails.config.custom.logCheckInterval,
        }
      });
  }

  async destroy() {
    await sails.helpers.redis.bull.removeRepeatable(this.server.id);
    this.queue.removeListener('global:completed', this.listener);
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
      sails.log.debug(`Got ${result.logs.length} logs for server ${this.server.id}`, {server: this.server});
    }


    const promises = result.logs.map(l => this.handleMessage(l));

    await Promise.all(promises);
    // This return is not really used
    // The purpose for this is to use it in tests
    // to help assert that 'nothing happened'
    return result.logs;
  }
}

module.exports = SdtdPolling;
