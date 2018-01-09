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

  var loggingInfoMap = new Map();

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
        sails.log.debug('HOOK: Initializing sdtdlogs')
        sails.models.sdtdserver.find({
          loggingEnabled: true
        }).exec(function (err, enabledServers) {
          if (err) {
            sails.log.error(new Error("Error getting logging enabled servers from DB"));
            throw err;
          }

          _.each(enabledServers, function (server) {
            createLogObject(server.id);
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

    start: function (serverID) {

      if (!loggingInfoMap.has(parseInt(serverID))) {
        return sails.models.sdtdserver.update({
            id: serverID
          }, {
            loggingEnabled: true
          })
          .exec(function () {
            return createLogObject(serverID);
          });
      } else {
        let error = new Error("Tried to start logging for a server that already had it enabled");
        sails.log.error(error);
      }
    },

    /**
     * @name stop
     * @memberof module:7dtdLoggingHook
     * @description Stops logging for a server
     * @param {number} serverID - Id of the server
     * @method
     */

    stop: function (serverID) {
      if (loggingInfoMap.has(serverID)) {
        return sails.models.sdtdserver.update({
            id: serverID
          }, {
            loggingEnabled: false
          })
          .exec(function () {
            let loggingObj = loggingInfoMap.get(serverID);
            loggingObj.stop();
            loggingInfoMap.delete(serverID)
          });
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
        return loggingInfoMap.get(serverId)
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
    sails.models.sdtdserver.findOne({
      id: serverID
    }).exec(function (error, server) {
      if (error) {
        sails.log.error(new Error(`Error creating a logging object for ${server.id}`));
        throw error;
      }

      sevenDays.startLoggingEvents({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
      }).exec({
        error: function (error) {
          sails.log.error(new Error(`Error starting logs for ${server.id}`));
          throw error;
        },
        success: function (eventEmitter) {
          loggingInfoMap.set(server.id, eventEmitter);

          eventEmitter.on('logLine', function (logLine) {
            sails.sockets.broadcast(server.id, 'logLine', logLine);
          });

          eventEmitter.on('chatMessage', function (chatMessage) {
            sails.sockets.broadcast(server.id, 'chatMessage', chatMessage);
          });

          eventEmitter.on('playerConnected', function (connectedMsg) {
            sails.sockets.broadcast(server.id, 'playerConnected', connectedMsg);
            sails.helpers.loadPlayerData(server.id, connectedMsg.steamID)
          });

          eventEmitter.on('playerDisconnected', function (disconectedMsg) {
            sails.sockets.broadcast(server.id, 'playerDisconected', disconectedMsg);
          });

          eventEmitter.on('playerDeath', function (deathMessage) {
            sails.sockets.broadcast(server.id, 'playerDeath', deathMessage);
          });
        }
      });
    });

  }
}
