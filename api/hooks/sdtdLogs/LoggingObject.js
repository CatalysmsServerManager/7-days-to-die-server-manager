const EventEmitter = require('events');
const enrichEventData = require('./enrichers');

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

    if (newLog.type !== 'logLine') {
      enrichedLog = await enrichEventData(enrichedLog);
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

}


module.exports = LoggingObject;
