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
            executeHook(eventData, hookToExec);
          }
        });
      }

    },

  };

  async function executeHook(eventData, hookToExec) {
    try {
      let server = await SdtdServer.findOne(eventData.server.id);

      let player = await enrichPlayerData(eventData, server);

      let results = await sails.helpers.sdtd.executeCustomCmd(server, hookToExec.commandsToExecute.split(';'), player);
      sails.log.debug(`Executed a custom hook for server ${eventData.server.id}`, {
        hook: hookToExec,
        event: eventData,
        results: results
      });
    } catch (error) {
      sails.log.error(error);
    }
  }

  // Take data from the log event (steamId, playerName, ...) and get the appropriate database record.
  async function enrichPlayerData(eventData, server) {
    let player;
    if (!_.isEmpty(eventData.steamId)) {
      player = await sails.helpers.sdtd.loadPlayerData.with({
        serverId: server.id,
        steamId: eventData.steamId
      });
      player = player[0];
    }

    if (!_.isEmpty(eventData.steamID)) {
      player = await sails.helpers.sdtd.loadPlayerData.with({
        serverId: server.id,
        steamId: eventData.steamID
      });
      player = player[0];
    }

    // If we do not find the player via steamId, we try via name.
    if (_.isUndefined(player)) {
      if (!_.isEmpty(eventData.playerName)) {
        player = await Player.findOne({
          name: eventData.playerName,
          server: server.id
        });
      }
    }

    return player;
  }

};
