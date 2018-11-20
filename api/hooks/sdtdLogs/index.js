var sevenDays = require('machinepack-7daystodiewebapi');
const LoggingObject = require('./LoggingObject');
const EventEmitter = require('events');

/**
 * @module 7dtdLoggingHook
 * @description Detects events on a 7dtd server.
 */
module.exports = function sdtdLogs(sails) {

  /**
   * @var {Map} loggingInfoMap Keeps track of servers with logging activated
   * @private
   */

  let loggingInfoMap = new Map();

  return {
    /**
     * @name initialize
     * @memberof module:7dtdLoggingHook
     * @description Called on app launch, loads all servers which have logging enabled and creates logging objects for these
     * @method
     * @private
     */
    initialize: function (cb) {
      sails.on('hook:discordbot:loaded', async () => {
        sails.log.info('Initializing custom hook (`sdtdLogs`)');

        try {
          let enabledServers = await SdtdConfig.find({
            loggingEnabled: true
          });
          for (let config of enabledServers) {
            await this.start(config.server)
          }
          sails.log.info(`HOOK: Sdtdlogs - Initialized ${loggingInfoMap.size} logging instances`);
          return cb();
        } catch (error) {
          sails.log.error(`HOOKS - sdtdLogs - ${error}`);
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
      try {
        if (!loggingInfoMap.has(serverID)) {
          sails.log.debug(`HOOKS - sdtdLogs - starting logging for server ${serverID}`);
          await SdtdConfig.update({
            server: serverID
          }, {
            loggingEnabled: true
          });
          let loggingObj = await createLogObject(serverID);
          loggingInfoMap.set(serverID, loggingObj);
          sails.hooks.playertracking.start(serverID);
          sails.hooks.customdiscordnotification.start(serverID);
          return
        } else {
          throw new Error(`Tried to start logging for a server that already had it enabled`);
        }

      } catch (error) {
        sails.log.error(`HOOKS - sdtdLogs - ${error}`);
      }
    },

    /**
     * @name stop
     * @memberof module:7dtdLoggingHook
     * @description Stops logging for a server
     * @param {number} serverID - Id of the server
     * @method
     */

    stop: async function (serverID) {
      serverID = String(serverID);
      try {
        if (loggingInfoMap.has(serverID)) {
          sails.log.debug(`HOOKS - sdtdLogs - stopping logging for server ${serverID}`);
          await SdtdConfig.update({
            server: serverID
          }, {
            loggingEnabled: false
          });
          let loggingObj = loggingInfoMap.get(serverID);
          loggingInfoMap.delete(serverID);
          return loggingObj.stop();
        }
      } catch (error) {
        sails.log.error(`HOOKS - sdtdLogs - ${error}`);
      }


    },

    /**
     * @name getLoggingObject
     * @memberof module:7dtdLoggingHook
     * @description Gets the logging object for a server
     * @param {number} serverId - Id of the server
     * @method
     */

    getLoggingObject: function (serverId) {
      let obj = loggingInfoMap.get(String(serverId));
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
      let status = loggingInfoMap.has(serverId);
      return status;
    }
  };

  /**
   * @name createLoggingObject
   * @memberof module:7dtdLoggingHook
   * @description Creates a logging object for a 7dtd server
   * @param {number} serverID - Id of the server
   * @method
   * @private
   */

  async function createLogObject(serverID) {

    let server = await SdtdServer.findOne(serverID);

    let eventEmitter = new EventEmitter;
    let version;

    try {
      version = await sails.helpers.sdtd.checkModVersion('Game version', server.id);
    } catch (error) {
      sails.log.warn(`Could not determine version info of server ${serverID} during logging initialization - defaulting to pre A17 logging code.`);
    }
    if (version === "Alpha 17") {
      eventEmitter = new LoggingObject(server.ip, server.webPort, server.authName, server.authToken);
    } else {
      sevenDays.startLoggingEvents({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
      }).exec({
        error: function (error) {
          reject(error);
        },
        success: (logObj) => {
          eventEmitter = logObj;
        }
      });
    }

    eventEmitter.on('logLine', function (logLine) {
      logLine.server = _.omit(server, "authName", "authToken");
      sails.sockets.broadcast(server.id, 'logLine', logLine);
    });

    eventEmitter.on('chatMessage', function (chatMessage) {
      chatMessage.server = _.omit(server, "authName", "authToken");
      sails.sockets.broadcast(server.id, 'chatMessage', chatMessage);
      sails.log.verbose(`Detected a chat message`, chatMessage);
    });

    eventEmitter.on('playerConnected', async function (connectedMsg) {
      connectedMsg.server = _.omit(server, "authName", "authToken");
      let playerData = await sails.helpers.sdtd.loadPlayerData(server.id, connectedMsg.steamID);
      connectedMsg.player = playerData[0];
      await sails.hooks.discordnotifications.sendNotification({
        serverId: server.id,
        notificationType: 'playerConnected',
        player: playerData[0]
      })
      if (connectedMsg.country != null) {
        await Player.update({
          server: server.id,
          steamId: connectedMsg.steamID
        }, {
          country: connectedMsg.country
        })
      }
      sails.sockets.broadcast(server.id, 'playerConnected', connectedMsg);
      sails.log.verbose(`Detected a player connected`, connectedMsg);
    });

    eventEmitter.on('playerDisconnected', async function (disconnectedMsg) {
      disconnectedMsg.server = _.omit(server, "authName", "authToken");
      let playerData = await sails.helpers.sdtd.loadPlayerData(server.id, disconnectedMsg.playerID);
      disconnectedMsg.player = playerData[0]
      await sails.hooks.discordnotifications.sendNotification({
        serverId: server.id,
        notificationType: 'playerDisconnected',
        player: playerData[0]
      })
      sails.sockets.broadcast(server.id, 'playerDisconnected', disconnectedMsg);
      sails.log.verbose(`Detected a player disconnected`, disconnectedMsg);
    });

    eventEmitter.on('connectionLost', async function (eventMsg) {
      if (eventMsg) {
        eventMsg.server = _.omit(server, "authName", "authToken");;
      }

      sails.sockets.broadcast(server.id, 'connectionLost', eventMsg);
      await sails.hooks.discordnotifications.sendNotification({
        serverId: server.id,
        notificationType: 'connectionLost',
        msg: eventMsg
      })
      sails.log.debug(`Lost connection to server ${server.name}`);
    });

    eventEmitter.on('connected', async function (eventMsg) {
      if (eventMsg) {
        eventMsg.server = _.omit(server, "authName", "authToken");;
      }

      sails.sockets.broadcast(server.id, 'connected', eventMsg);
      await sails.hooks.discordnotifications.sendNotification({
        serverId: server.id,
        notificationType: 'connected'
      })

      sails.log.debug(`Connected to server ${server.name}`);
    });

    eventEmitter.on('playerDeath', function (deathMessage) {
      deathMessage.server = _.omit(server, "authName", "authToken");;
      sails.sockets.broadcast(server.id, 'playerDeath', deathMessage);
    });

    eventEmitter.on('memUpdate', (memUpdate) => {
      memUpdate.server = _.omit(server, "authName", "authToken");;
      sails.sockets.broadcast(server.id, 'memUpdate', memUpdate);
    });

    return eventEmitter;
  }


};
