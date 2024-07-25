const Sentry = require('@sentry/node');
const SdtdSSE = require('./eventDetectors/7d2dSSE');
const SdtdPolling = require('./eventDetectors/7d2dPolling');
const SdtdSSEV1 = require('./eventDetectors/7d2dV1SSE');
/**
 * @module 7dtdLoggingHook
 * @description Detects events on a 7dtd server.
 */
module.exports = function sdtdLogs(sails) {



  return {
    /**
   * @var {Map} loggingInfoMap Keeps track of servers with logging activated
   * @private
   */

    loggingInfoMap: new Map(),
    /**
     * @name initialize
     * @memberof module:7dtdLoggingHook
     * @description Called on app launch, loads all servers which have logging enabled and creates logging objects for these
     * @method
     * @private
     */
    initialize: function (cb) {
      // eslint-disable-next-line callback-return
      cb();
      sails.after('lifted', async () => {
        sails.log.info('Initializing custom hook (`sdtdLogs`)');
        queue = await sails.helpers.getQueueObject('logs');
        try {
          const enabledServers = await SdtdConfig.find({ inactive: false });
          const nonDisabledServers = await SdtdServer.find({ id: { in: enabledServers.map(server => server.server) }, disabled: false });
          const promises = [];
          for (let server of nonDisabledServers) {
            promises.push(this.start(server.id));
          }

          // If after 10 seconds the promises are not fulfilled yet, we continue initialization anyways
          setTimeout(() => sails.emit('hook:sdtdLogs:ready'), 10000);

          try {
            await Promise.all(promises);
          } catch (e) {
            Sentry.captureException(e);
            sails.log.error(e.stack);
          }

          sails.log.debug(`HOOK: Sdtdlogs - Initialized ${this.loggingInfoMap.size} logging instances`);
          sails.emit('hook:sdtdLogs:ready');
        } catch (error) {
          sails.log.error(`HOOKS - sdtdLogs`, error);
        }
      });
    },

    /**
     * @name start
     * @memberof module:7dtdLoggingHook
     * @description Starts logging for a server
     * @param {number} serverID - Id of the server
     * @method
     */

    start: async function (serverID) {
      serverID = String(serverID);

      if (!this.loggingInfoMap.has(serverID)) {
        return this.createLogObject(serverID);
      }
    },

    /**
     * @name stop
     * @memberof module:7dtdLoggingHook
     * @description Stops logging for a server
     * @param {number} serverId - Id of the server
     * @method
     */

    stop: async function (serverId) {
      serverId = String(serverId);

      sails.log.debug(`HOOKS - sdtdLogs - stopping logging for server ${serverId}`, { serverId });

      const loggingObj = await this.getLoggingObject(serverId);
      if (loggingObj) {
        await loggingObj.stop();
      }

      if (this.loggingInfoMap.has(serverId)) {
        this.loggingInfoMap.delete(serverId);
      }

      await sails.helpers.redis.bull.removeRepeatable(serverId);
    },

    /**
     * @name getLoggingObject
     * @memberof module:7dtdLoggingHook
     * @description Gets the logging object for a server
     * @param {number} serverId - Id of the server
     * @method
     */

    getLoggingObject: async function (serverId) {
      let obj = this.loggingInfoMap.get(String(serverId));
      return obj;
    },

    /**
     * @name getStatus
     * @memberof module:7dtdLoggingHook
     * @description Gets the logging status for a server
     * @param {number} serverId - Id of the server
     * @method
     */

    getStatus: function (serverId) {
      serverId = String(serverId);
      return this.loggingInfoMap.has(serverId);
    },

    async getEventDetectorClass(server) {

      try {
        const allocsVersion = (await Promise.all([
          sails.helpers.sdtd.checkModVersion('Mod Allocs MapRendering and Webinterface', server.id),
          sails.helpers.sdtd.checkModVersion('Mod Allocs_Webinterface', server.id),
        ])).find(v => !!v) || 0;

        if(allocsVersion > 47) {
          return SdtdSSEV1;
        }

        if (allocsVersion < 38) {
          return SdtdPolling;
        } else {
          return SdtdSSE;
        }
      } catch (error) {
        sails.log.warn(`Could not get allocs version, defaulting to SSEV1 - ${error}`, { server });
        return SdtdSSEV1;
      }


    },

    /**
   * @name createLoggingObject
   * @memberof module:7dtdLoggingHook
   * @description Creates a logging object for a 7dtd server
   * @param {number} serverId - Id of the server
   * @method
   * @private
   */

    createLogObject: async function createLogObject(serverId) {
      sails.log.debug(`HOOKS - sdtdLogs - Creating loggingObject for server ${serverId}`, { serverId });

      // Remove any lingering repeatable jobs
      await sails.helpers.redis.bull.removeRepeatable(serverId);


      serverId = String(serverId);
      const server = await SdtdServer.findOne(serverId);
      const config = await SdtdConfig.findOne({ server: serverId });
      server.config = config;

      const detectorClass = await this.getEventDetectorClass(server);
      const eventEmitter = new detectorClass(server);
      await eventEmitter.start();

      this.loggingInfoMap.set(serverId, eventEmitter);

      eventEmitter.on('logLine', function (logLine) {
        logLine.server = _.omit(server, 'authName', 'authToken');
        sails.sockets.broadcast(server.id, 'logLine', logLine);
      });

      eventEmitter.on('chatMessage', function (chatMessage) {
        if(!chatMessage.playerName) {chatMessage.playerName = chatMessage.player.name;};
        chatMessage.server = _.omit(server, 'authName', 'authToken');
        chatMessage.player = _.omit(chatMessage.player, 'inventory');

        sails.sockets.broadcast(server.id, 'chatMessage', chatMessage);
        sails.log.debug(`Detected a chat message`, { server });
      });

      eventEmitter.on('playerConnected', async function (connectedMsg) {

        connectedMsg.server = _.omit(server, 'authName', 'authToken');
        await sails.helpers.discord.sendNotification({
          serverId: server.id,
          notificationType: 'playerConnected',
          player: connectedMsg.player
        });

        if (connectedMsg.steamId) {
          const updateObject = {};

          if (connectedMsg.country) {
            updateObject.country = connectedMsg.country;
          }

          if (connectedMsg.crossId) {
            updateObject.crossId = connectedMsg.crossId;
          }

          await Player.update({
            server: server.id,
            steamId: connectedMsg.steamId
          }, updateObject);
        }

        sails.sockets.broadcast(server.id, 'playerConnected', connectedMsg);
        connectedMsg.player = _.omit(connectedMsg.player, 'inventory');
        sails.log.debug(`Detected a player connected`, { server, player: connectedMsg.player });
      });


      eventEmitter.on('playerJoined', async function (joinMsg) {
        joinMsg.server = _.omit(server, 'authName', 'authToken');
        joinMsg.player = _.omit(joinMsg.player, 'inventory');

        sails.sockets.broadcast(server.id, 'playerJoined', joinMsg);
        sails.log.debug(`Detected a player joined`, { server, player: joinMsg.player });
      });

      eventEmitter.on('playerDisconnected', async function (disconnectedMsg) {
        disconnectedMsg.server = _.omit(server, 'authName', 'authToken');
        await sails.helpers.discord.sendNotification({
          serverId: server.id,
          notificationType: 'playerDisconnected',
          player: disconnectedMsg.player
        });
        sails.sockets.broadcast(server.id, 'playerDisconnected', disconnectedMsg);
        disconnectedMsg.player = _.omit(disconnectedMsg.player, 'inventory');
        sails.log.debug(`Detected a player disconnected`, { server, player: disconnectedMsg.player });
      });

      eventEmitter.on('connectionLost', async function (eventMsg) {
        if (eventMsg) {
          eventMsg.server = _.omit(server, 'authName', 'authToken');;
        }

        sails.sockets.broadcast(server.id, 'connectionLost', eventMsg);
        await sails.helpers.discord.sendNotification({
          serverId: server.id,
          notificationType: 'connectionLost',
          msg: eventMsg
        });
        sails.log.debug(`Lost connection to server ${server.name}`, { server });
      });

      eventEmitter.on('connected', async function (eventMsg) {
        if (eventMsg) {
          eventMsg.server = _.omit(server, 'authName', 'authToken');;
        }

        sails.sockets.broadcast(server.id, 'connected', eventMsg);
        await sails.helpers.discord.sendNotification({
          serverId: server.id,
          notificationType: 'connected'
        });

        sails.log.debug(`Connected to server ${server.name}`, { server });
      });

      eventEmitter.on('playerDeath', function (deathMessage) {
        deathMessage.server = _.omit(server, 'authName', 'authToken');
        sails.sockets.broadcast(server.id, 'playerDeath', deathMessage);
      });

      eventEmitter.on('memUpdate', (memUpdate) => {
        memUpdate.server = _.omit(server, 'authName', 'authToken');
        sails.sockets.broadcast(server.id, 'memUpdate', memUpdate);
        sails.helpers.getQueueObject('playerTracking').add(server.id);
      });

      return eventEmitter;
    }
  };
};
