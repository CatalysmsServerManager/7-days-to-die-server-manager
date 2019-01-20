const SdtdApi = require('7daystodie-api-wrapper');
const EventEmitter = require('events');
const handleLogLine = require('./handleLogLine');
const redis = require('./RedisConnector');

class EventObject extends EventEmitter {

  constructor(serverId) {
    super();
    this.serverId = serverId;
    this.debug = true;
    this.redisEmitter = redis.getEmitter();

    this.redisEmitter.on('event', (data) => {
      data = JSON.parse(data);
      this._listener(data);
    });
  }

  _listener(data) {

    if (_.isUndefined(data) || _.isUndefined(data.server) || _.isUndefined(data.server.id)) {
      throw new Error(`Invalid event data received. ${JSON.stringify(data)}`);
    }

    if (String(data.server.id) === this.serverId) {
      this.emit(data.type, data.data);

      if (this.debug) {
        sails.log.debug(`SdtdLogs - DEBUG MESSAGE - ${JSON.stringify(data)}`);
      }
    }
  }

  stop() {
    removeAllListeners(this.redisEmitter);
    return;
  }

  _toggleDebug() {
    this.debug = !this.debug;
  }

}

module.exports = EventObject;
