const CommandHandler = require('./commandHandler.js');
/**
 * @module SdtdCommandsHook
 * @description a Sails project hook. Ingame command handler for Sdtd
 * @param {*} sails Global sails instance
 */

/**
 * @module SdtdCommands
 * @description Command guide for users
 */

module.exports = function sdtdCommands(sails) {

  /**
   * @var {Map} commandInfoMap Keeps track of servers with commands activated
   * @private
   */

  let commandInfoMap = new Map();

  return {

    /**
     * @memberof module:SdtdCommandsHook
     * @method
     * @name initialize
     * @description Initializes the ingame command listener(s)
     */
    initialize: async function (cb) {
      sails.on('hook:orm:loaded', async function () {
        sails.on('hook:sdtdlogs:loaded', async function () {
          try {
            let enabledServers = await SdtdConfig.find({
              commandsEnabled: true
            });

            for (const config of enabledServers) {
              await start(config.server);
            }

            sails.log.info(`HOOK SdtdCommands - initialized ${commandInfoMap.size} ingame command listeners`);
          } catch (error) {
            sails.log.error(`HOOK SdtdCommands:initialize - ${error}`);
          }
          cb();
        });
      });
    },

    /**
     * @memberof module:SdtdCommandsHook
     * @method
     * @name start
     * @description Starts the ingame command listener(s)
     */

    start: start,

    /**
     * @memberof module:SdtdCommandsHook
     * @method
     * @name stop
     * @description Stops the ingame command listener(s)
     */

    stop: stop,

    /**
     * @memberof module:SdtdCommandsHook
     * @method
     * @name getStatus
     * @description Get the commands status for a server
     * @returns {boolean}
     */

    getStatus: function (serverId) {
      return commandInfoMap.has(String(serverId));
    },

    getAmount: function() {
      return commandInfoMap.size;
    },

    /**
     * @memberof module:SdtdCommandsHook
     * @method
     * @name reload
     * @description Updates command config for a server and reload the hook
     */

    reload: async function (serverId) {
      try {
        sails.log.debug(`HOOK sdtdCommands:reload - Reloading commands config for server ${serverId}`);

        let newConfig = await SdtdConfig.findOne({server: serverId});

        if (newConfig.commandsEnabled) {
          this.start(serverId);
        } else {
          this.stop(serverId);
        }

      } catch (error) {
        sails.log.error(`HOOK SdtdCommands:reload - ${error}`);
        throw error;
      }
    }

  };

  async function start(serverId) {

    try {
      sails.log.debug(`HOOK sdtdCommands:start - Starting commands for server ${serverId}`);
      let serverConfig = await SdtdConfig.findOne({
        server: serverId
      });
      if (serverConfig.commandsEnabled) {

        if (commandInfoMap.has(String(serverId))) {
          await this.stop(serverId)
        }

        let serverLoggingObj = sails.hooks.sdtdlogs.getLoggingObject(String(serverId));
        let commandHandler = new CommandHandler(serverId, serverLoggingObj, serverConfig);
        commandInfoMap.set(String(serverId), commandHandler);
        return true;
      }
    } catch (error) {
      sails.log.error(`HOOK SdtdCommands:start - ${error}`);
      throw error;
    }
  }

  async function stop(serverId) {
    try {
      sails.log.debug(`HOOK sdtdCommands:stop - Stopping commands for server ${serverId}`);
      let commandHandler = commandInfoMap.get(String(serverId));
      if (!_.isUndefined(commandHandler)) {
        commandHandler.stop();
        return commandInfoMap.delete(String(serverId));
      }
      return;
    } catch (error) {
      sails.log.error(`HOOK SdtdCommands:stop - ${error}`);
      throw error;
    }
  }
};
