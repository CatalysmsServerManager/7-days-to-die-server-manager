const hhmmss = require('@streammedev/hhmmss');

module.exports = {


  friendlyName: 'Start usage stats gathering',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    sails.usageStatsInterval = setInterval(async () => {
      try {
        let lastStatsEntry = await UsageStats.find({
          limit: 1,
          sort: 'createdAt DESC'
        });

        if ((Date.now() - sails.config.custom.usageStatsInterval) > (_.isUndefined(lastStatsEntry[0]) ? 0 : lastStatsEntry[0].createdAt)) {
          let currentStats = await sails.helpers.meta.loadSystemStatsAndInfo();

          await UsageStats.create({
            discordGuilds: currentStats.guilds,
            discordUsers: currentStats.users,
            servers: currentStats.servers,
            players: currentStats.players,
            teleportLocations: currentStats.amountOfTeleports,
            timesTeleported: currentStats.amountOfTimesTeleported,
            customCommands: currentStats.amountOfCustomCommands,
            customCommandsUsed: currentStats.amountOfCustomCommandsExecuted,
            chatBridges: currentStats.chatBridges,
            countryBans:currentStats.countryBans,
            ingameCommands: currentStats.guilds,
            gblEntries: currentStats.gblEntries,
            cronJobs: currentStats.cronJobs,
            pingKickers: currentStats.pingKickers,
            openTickets: currentStats.openTickets,
            closedTickets: currentStats.closedTickets,
            gblComments: currentStats.gblComments,
          });

          sails.log.info(`Gathered system usage information.`, currentStats);
        }

        sails.log.debug(`Checked if we need to get system stats - ${(Date.now() - sails.config.custom.usageStatsInterval) > (_.isUndefined(lastStatsEntry[0]) ? 0 : lastStatsEntry[0].createdAt)}`);
      } catch (error) {
        sails.log.error(error);
      }

    }, 360000);
    return exits.success();

  }


};
