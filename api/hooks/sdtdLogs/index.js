var sevenDays = require('machinepack-7daystodiewebapi');

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
      sails.on('hook:orm:loaded', function () {
        sails.log.debug('HOOK: Initializing sdtdlogs');
        sails.models.sdtdserver.find({
          loggingEnabled: true
        }).exec(function (err, enabledServers) {
          if (err) {
            sails.log.error(`HOOKS - sdtdLogs - ${err}`);
          }

          _.each(enabledServers, async function (server) {
            try {
              let loggingObj = await createLogObject(server.id);
              return loggingInfoMap.set(String(server.id), loggingObj);
            } catch (error) {
              sails.log.error(`HOOKS - sdtdLogs - ${error}`);
            }

          });
        });
        return cb();
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
      serverID = String(serverID)
      try {
        if (!loggingInfoMap.has(serverID)) {
          sails.log.debug(`HOOKS - sdtdLogs - starting logging for server ${serverID}`)
          await sails.models.sdtdserver.update({
            id: serverID
          }, {
            loggingEnabled: true
          })
          let loggingObj = await createLogObject(serverID);
          return loggingInfoMap.set(serverID, loggingObj);
        } else {
          throw new Error(`Tried to start logging for a server that already had it enables`)
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

      try {
        if (loggingInfoMap.has(serverID)) {
          sails.log.debug(`HOOKS - sdtdLogs - stopping logging for server ${serverID}`)
          await sails.models.sdtdserver.update({
            id: serverID
          }, {
            loggingEnabled: false
          })
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
      let obj = loggingInfoMap.get(serverId);
      return obj
    },

    /**
     * @name getStatus
     * @memberof module:7dtdLoggingHook
     * @description Gets the logging status for a server
     * @param {number} serverId - Id of the server
     * @method
     */

    getStatus: function (serverId) {
      serverId = String(serverId)
      let status = loggingInfoMap.has(serverId);
      return status
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

  function createLogObject(serverID) {
    return new Promise((resolve, reject) => {
      sails.models.sdtdserver.findOne({
        id: serverID
      }).exec(function (error, server) {
        if (error) {
          reject(error)
        }

        sevenDays.startLoggingEvents({
          ip: server.ip,
          port: server.webPort,
          authName: server.authName,
          authToken: server.authToken,
        }).exec({
          error: function (error) {
            reject(error)
          },
          success: function (eventEmitter) {
            eventEmitter.on('logLine', function (logLine) {
              sails.sockets.broadcast(server.id, 'logLine', logLine);
            });

            eventEmitter.on('chatMessage', function (chatMessage) {
              sails.sockets.broadcast(server.id, 'chatMessage', chatMessage);
            });

            eventEmitter.on('playerConnected', async function (connectedMsg) {
              try {
                await sails.helpers.loadPlayerData(server.id, connectedMsg.steamID);
                sails.sockets.broadcast(server.id, 'playerConnected', connectedMsg);
              } catch (error) {
                sails.sockets.broadcast(server.id, 'playerConnected', connectedMsg);
                sails.log.error(`HOOKS - sdtdLogs - ${error}`)
              }

            });

            eventEmitter.on('playerDisconnected', function (disconectedMsg) {
              sails.sockets.broadcast(server.id, 'playerDisconected', disconectedMsg);
            });

            eventEmitter.on('playerDeath', function (deathMessage) {
              sails.sockets.broadcast(server.id, 'playerDeath', deathMessage);
            });
            resolve(eventEmitter)
          }
        });
      });
    })


  }
};
