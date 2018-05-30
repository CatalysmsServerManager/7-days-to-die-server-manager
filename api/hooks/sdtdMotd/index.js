var sevenDays = require('machinepack-7daystodiewebapi');
const MotdSender = require('./motdSenderClass.js');

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

        sails.on('hook:sdtdlogs:loaded', async function () {
          try {
            let enabledServers = await SdtdConfig.find({
              motdEnabled: true
            }).populate('server');

            for (const config of enabledServers) {
              let server = config.server;
              let motdSender = new MotdSender(server.id, config);
              motdInfoMap.set(String(server.id), motdSender);
            }
            sails.log.info(`HOOK: sdtdMotd - Initialized ${motdInfoMap.size} MOTD instances`);
            return cb();
          } catch (error) {
            sails.log.error(`HOOKS - sdtdMotd:initialize - ${error}`);
          }
        });

    },

    /**
     * @name start
     * @memberof module:7dtdMOTDHook
     * @description Starts Motd for a server
     * @param {number} serverId
     * @method
     */

    start: async function (serverId) {
      try {
        if (!motdInfoMap.has(String(serverId))) {
          sails.log.debug(`HOOKS - sdtdMotd:start - starting motd for server ${serverId}`);

          let config = await SdtdConfig.findOne({
            server: serverId
          });

          if (!config.motdEnabled) {
            return;
          }

          let motdSender = new MotdSender(serverId, config);

          return motdInfoMap.set(String(serverId), motdSender);
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
        if (motdInfoMap.has(String(serverId))) {
          sails.log.debug(`HOOKS - sdtdMotd:stop - stopping MOTD for server ${serverId}`);

          let motdSender = motdInfoMap.get(String(serverId));
          motdSender.stop();
          return motdInfoMap.delete(String(serverId));
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
      return motdInfoMap.has(String(serverId));
    },

    getAmount: function() {
      return motdInfoMap.size;
    },

    /**
     * @name updateConfig
     * @memberof module:7dtdMOTDHook
     * @description Set new values for motd config
     * @param {number} serverId - Id of the server
     * @param {string} newMessage
     * @param {number} newDelay
     * @param {boolean} newStatus motdEnabled
     * @param {boolean} newStatusOnJoin motdOnJoinEnabled
     * @method
     */

    updateConfig: async function (serverId, newMessage, newDelay, newStatus, newStatusOnJoin) {

      try {

        await SdtdConfig.update({
          server: serverId
        }, {
          motdMessage: newMessage,
          motdEnabled: newStatus,
          motdOnJoinEnabled: newStatusOnJoin,
          motdInterval: newDelay
        });

        this.stop(serverId);
        this.start(serverId);

      } catch (error) {
        return sails.log.error(`HOOKS - sdtdMotd:updateConfig - ${error}`);
      }

    }
  };


};
