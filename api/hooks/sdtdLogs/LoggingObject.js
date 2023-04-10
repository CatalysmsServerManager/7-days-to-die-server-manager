const EventEmitter = require('events');
const enrichEventData = require('./enrichers');
const crypto = require('crypto');

class LoggingObject extends EventEmitter {
  constructor(server) {
    super();

    if (!server.config) {
      throw new Error('Must provide a server with a config property');
    }

    this.server = server;
  }

  async start() { throw new Error('Not implemented'); }
  async destroy() { throw new Error('Not implemented'); }
  async stop() {
    this.removeAllListeners();
    await this.destroy();
  }

  async handleMessage(newLog) {
    let enrichedLog = newLog;
    enrichedLog.server = this.server;
    enrichedLog.data.server = this.server;

    const eventHash = crypto.createHash('sha1').update(JSON.stringify(enrichedLog)).digest('base64');

    if (newLog.type !== 'logLine') {
      const data = { type: 'logLine', data: enrichedLog.data, server: this.server };
      const eventHashForLog = crypto.createHash('sha1').update(JSON.stringify(data)).digest('base64');

      enrichedLog.data = await enrichEventData(enrichedLog.data);
      sails.helpers.getQueueObject('hooks').add(data, { jobId: eventHashForLog });
    }

    sails.log.debug(
      `Log line for server ${this.server.id} - ${newLog.type} - ${newLog.data.msg}`, { serverId: this.server.id }
    );

    sails.helpers.getQueueObject('hooks').add(enrichedLog, { jobId: eventHash });
    sails.helpers.getQueueObject('customNotifications').add(enrichedLog, { jobId: eventHash });


    if (newLog.type === 'chatMessage') {
      sails.helpers.getQueueObject('sdtdCommands').add(enrichedLog, { jobId: eventHash });
    }

    this.emit(enrichedLog.type, enrichedLog.data);

  }

}


module.exports = LoggingObject;
