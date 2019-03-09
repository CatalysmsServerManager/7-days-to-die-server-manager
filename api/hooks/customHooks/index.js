const sevenDays = require('7daystodie-api-wrapper');

module.exports = function defineCustomHooksHook(sails) {

  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: async function (done) {

      sails.on('hook:sdtdlogs:loaded', async () => {

        sails.log.info('Initializing custom hooks');

        let enabledServers = await SdtdConfig.find({
          loggingEnabled: true
        });

        for (let config of enabledServers) {
          await this.start(config.server)
        }

        return;

      });

      return done();
    },

    start: async function (serverId) {
      let loggingObject = sails.hooks.sdtdlogs.getLoggingObject(serverId);

      for (const eventType of sails.config.custom.supportedHooks) {
        loggingObject.on(eventType, async eventData => {
          let configuredHooks = await CustomHook.find({
            server: serverId,
            event: eventType
          });

          for (const hookToExec of configuredHooks) {
            executeHook(eventData, hookToExec, serverId);
          }
        });
      }

      sails.log.debug(`Started customHooks module for server ${serverId}`)

    },

  };

  async function executeHook(eventData, hookToExec, serverId) {
    try {
      let server = await SdtdServer.findOne(serverId);

      let results = await sails.helpers.sdtd.executeCustomCmd(server, hookToExec.commandsToExecute.split(';'), eventData);
      sails.log.debug(`Executed a custom hook for server ${serverId}`, {
        hook: hookToExec,
        event: eventData,
        results: results
      });
    } catch (error) {
      sails.log.error(error);
    }
  }

};
