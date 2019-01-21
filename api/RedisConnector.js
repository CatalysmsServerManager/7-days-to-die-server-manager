const Redis = require('ioredis');
const _ = require('lodash');
const EventEmitter = require('events').EventEmitter;

/**
 * Controller class for redis
 */
class RedisConnector {
  constructor() {
    this.client = new Redis();
    this.subscriber = this.client.duplicate();
    this.subscriber.subscribe('eventQueue', function (err, count) {
      if (err) {
        sails.log.error(err);
        throw err;
      }
      sails.log.info(`Successfully subscribed to redis event queue`);
    });
    this.emitter = new EventEmitter();
    this.subscriber.on('message', async (channel, message) => {
      await this.handleEvent(message);
    });
  }

  getEmitter() {
    return this.emitter;
  }

  /**
   * A servers data was updated
   * @param {Object} server 
   */
  async serverUpdate(server) {
    let dataObject = {
      type: 'update',
      id: server.id,
      name: server.name,
      ip: server.ip,
      webPort: server.webPort,
      authName: server.authName,
      authToken: server.authToken
    };
    let result = await this.client.publish(`serverUpdate`, JSON.stringify(dataObject));
    return result;
  }

    /**
   * A servers data was deleted
   * @param {Object} server 
   */
  async serverDelete(server) {
    let dataObject = {
      type: 'delete',
      id: server.id,
    };
    let result = await this.client.publish(`serverUpdate`, JSON.stringify(dataObject));
    return result;
  }

  async getQueueLength() {
    let result = await this.client.llen('eventDaemon:eventQueue');
    return result;
  }

  async handleEvent(message) {
    if (message === 'new') {
      const event = await this.getEventFromQueue();
      if (!_.isNull(event)) {
        this.emitter.emit('event', event);
      }
      // This makes sure the event queue gets emptied if there are leftover events
      let queueLength = await this.getQueueLength();
      if (queueLength > 0) {
        await this.handleEvent('new');
      }
    }

  }

  async getEventFromQueue() {
    let eventData = await this.client.lpop('eventDaemon:eventQueue');
    sails.log.verbose(`Popped event from event queue ${JSON.stringify(eventData)}`);
    return JSON.parse(eventData);
  }

  /**
   * Sets a key in redis
   * @param { String } key Name of the value
   * @param { Object } data JSON deserializable data
   * @param { Object } server
   * @param { Number } expiry ms before key gets deleted
   * @returns { Object } response from redis server
   */

  async set(key, data, server, expiry) {

    if (_.isUndefined(key) || _.isUndefined(data) || _.isUndefined(server) || _.isUndefined(server.id)) {
      throw new Error(`Invalid inputs. key, data, server and server.id are all required`);
    }

    let parsedData = data;

    if (!_.isString(data)) {
      parsedData = JSON.stringify(data);
    }
    let result
    if (expiry) {
      result = await this.client.set(`server:${server.id}:${key}`, parsedData, 'PX', expiry);
    } else {
      result = await this.client.set(`server:${server.id}:${key}`, parsedData);
    }
    return result;
  }

  /**
   * Gets a key from redis
   * @param { String } key 
   * @param { Object } server 
   * @returns { String } Response from redis server
   */
  async get(key, server) {
    if (_.isUndefined(key) || _.isUndefined(server) || _.isUndefined(server.id)) {
      throw new Error(`Invalid inputs, key, server and server.id are all required`);
    }
    let result = await this.client.get(`server:${server.id}:${key}`);
    return result;
  }
}

const client = new RedisConnector();

module.exports = client;
