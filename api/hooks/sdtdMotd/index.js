var sevenDays = require('machinepack-7daystodiewebapi');

/**
 * @module 7dtdMOTDHook
 * @description Detects events on a 7dtd server.
 */
module.exports = function sdtdLogs(sails) {

  /**
   * @var {Map} motdInfoMap Keeps track of servers with MOTD activated
   * @private
   */

  let motdInfoMap = new Map();

  return {
    /**
     * @name initialize
     * @memberof module:7dtdMOTDHook
     * @description Called on app launch, loads all servers which have logging enabled and creates logging objects for these
     * @method
     * @private
     */
    initialize: function (cb) {
      sails.on('hook:orm:loaded', async function () {

        try {
          sails.log.debug('HOOK: Initializing sdtdMotd');
          let enabledServers = await SdtdConfig.find({
            motdEnabled: true
          }).populate('server')

          await _.each(enabledServers, async function (config) {
            try {
              let server = config.server;
              // await this.start
            } catch (error) {
              sails.log.error(`HOOKS - sdtdMotd:initialize - ${error}`);
            }
          });
          return cb();
        } catch (error) {
          sails.log.error(`HOOKS - sdtdMotd:initialize - ${error}`);
        }
      })
    },

    /**
     * @name start
     * @memberof module:7dtdMOTDHook
     * @description Starts Motd for a server
     * @param {number} serverId
     * @method
     */

    start: async function (serverId) {
      serverId = String(serverId)
      try {
        if (!motdInfoMap.has(serverId)) {
          sails.log.debug(`HOOKS - sdtdMotd:start - starting motd for server ${serverId}`)

          let config = await SdtdConfig.update({
            server: serverId
          }, {
            motdEnabled: true
          }).fetch().limit(1)

          let loggingObj = sails.hooks.sdtdlogs.getLoggingObject(serverId);

          loggingObj.on('playerConnected', async function motdListener(connectedMessage) {
            await sendMotd(config.motdMessage, serverId, connectedMessage.steamID);
          })

          return motdInfoMap.set(serverId, {});
        }

      } catch (error) {
        sails.log.error(`HOOKS - sdtdMotd:start - ${error}`);
      }
    },

    /**
     * @name stop
     * @memberof module:7dtdMOTDHook
     * @description Stops MOTD for a server
     * @param {number} serverId - Id of the server
     * @method
     */

    stop: async function (serverId) {

      try {
        if (motdInfoMap.has(serverId)) {
          sails.log.debug(`HOOKS - sdtdMotd:stop - stopping MOTD for server ${serverId}`);

          await SdtdConfig.update({
            server: serverId
          }, {
            motdEnabled: false
          })


          motdInfoMap.delete(serverId);
          return loggingObj.stop();
        }
      } catch (error) {
        sails.log.error(`HOOKS - sdtdMotd:stop - ${error}`);
      }


    },


    /**
     * @name getStatus
     * @memberof module:7dtdMOTDHook
     * @description Gets the motd status for a server
     * @param {number} serverId - Id of the server
     * @method
     */

    getStatus: function (serverId) {
      serverId = String(serverId)
      return motdInfoMap.has(serverId);
    },

    /**
     * @name updateConfig
     * @memberof module:7dtdMOTDHook
     * @description Set new values for motd config
     * @param {number} serverId - Id of the server
     * @param {string} newMessage
     * @param {number} newDelay
     * @method
     */

    updateConfig: async function (serverId, newMessage, newDelay) {

    }
  };


};

/**
 * @name sendMotd
 * @memberof module:7dtdMOTDHook
 * @description sends the motd to the server or a player (if id is given)
 * @param {string} message
 * @param {number} serverId 
 * @param {string} playerSteamId If given, message will be sent as PM to the player
 */

async function sendMotd(message, serverId, playerSteamId) {
  try {
    let server = SdtdServer.findOne(serverId);

    if (_.isUndefined(server)) {
      return sails.log.error(`HOOKS - sdtdMotd:sendMotd - Unknown server id ${serverId}`);
    }

    sevenDays.sendMessage({
      ip: server.ip,
      port: server.webPort,
      authName: server.authName,
      authToken: server.authToken,
      message: message,
      playerID: playerSteamId,
    }).exec({
      success: (response) => {
        sails.log.debug(`HOOKS - sdtdMotd:sendMotd - Successfully sent MOTD message to server ${serverId}`);
      },
      unknownPlayer: (error) => {
        sails.log.error(`HOOKS - sdtdMotd:sendMotd - Tried to send message to unknown player ${serverId}`);
      },
      error: (error) => {
        sails.log.error(`HOOKS - sdtdMotd:sendMotd - Unknown server id ${serverId}`);
      }
    })

  } catch (error) {
    sails.log.error(`HOOKS - sdtdMotd:sendMotd - ${error}`);
  }
}
