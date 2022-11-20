const EventEmitter = require('events');
const enrichEventData = require('./enrichers');

class LoggingObject extends EventEmitter {
  constructor(server) {
    super();

    if (!server.config) {
      throw new Error('Must provide a server with a config property');
    }

    this.server = server;

    this.messageCache = new Map();
    this.dedupeCounter = 0;
  }

  async start() { throw new Error('Not implemented'); }
  async destroy() { throw new Error('Not implemented'); }
  async stop() {
    this.removeAllListeners();
    await this.destroy();
  }

  _dedupe(newLog) {
    const cacheKey = `${newLog.data.date}-${newLog.data.time}-${newLog.data.msg}`;

    if (this.dedupeCounter > 500) {
      sails.log.debug('Dedupe counter exceeded, clearing cache', { serverId: this.server.id });
      // Delete everything older than 1 minute
      const oneMinuteAgo = Date.now() - 60 * 1000;
      for (const [key, value] of this.messageCache) {
        if (value < oneMinuteAgo) {
          this.messageCache.delete(key);
        }
      }
      this.dedupeCounter = 0;
    }

    if (this.messageCache.has(cacheKey)) {
      return true;
    }

    this.dedupeCounter++;
    this.messageCache.set(cacheKey, new Date(`${newLog.data.date}T${newLog.data.time}`).valueOf());
    return false;
  }

  async handleMessage(newLog) {
    if (this._dedupe(newLog)) {
      sails.log.debug('Discarding a dupe event', { serverId: this.server.id, event: newLog });
      return;
    }

    let enrichedLog = newLog;
    enrichedLog.server = this.server;
    enrichedLog.data.server = this.server;

    if (newLog.type !== 'logLine') {
      enrichedLog.data = await enrichEventData(enrichedLog.data);
      sails.helpers.getQueueObject('hooks').add({ type: 'logLine', data: enrichedLog.data, server: this.server });
    }

    sails.log.debug(
      `Log line for server ${this.server.id} - ${newLog.type} - ${newLog.data.msg}`, { serverId: this.server.id }
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
