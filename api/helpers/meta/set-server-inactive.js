module.exports = {


  friendlyName: 'Set server inactive',


  description: 'Stops all hooks, timers, modules for a server',


  inputs: {

    serverId: {
      type: 'string',
      required: true,
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    const server = await SdtdServer.findOne(inputs.serverId).populate('config');

    if (_.isUndefined(server)) {
      return exits.error('Unknown server ID');
    }

    const config = server.config[0];

    // Countryban
    await sails.hooks.countryban.stop(server.id);

    //Cron
    const cronJobs = await CronJob.find({
      server: server.id,
      enabled: true
    });

    for (const jobToStop of cronJobs) {
      try {
        await sails.hooks.cron.stop(jobToStop.id);
      } catch (error) {
        sails.log.error(`Error initializing cronjob ${jobToStop.id} - ${error}`);
      }
    }

    // Chatbridge
    await sails.hooks.discordchatbridge.stop(server.id);

    // Economy
    if (config.playtimeEarnerEnabled) {
      await sails.hooks.economy.stop(server.id, 'playtimeEarner');
    }

    if (config.discordTextEarnerEnabled) {
      await sails.hooks.economy.stop(server.id, 'discordTextEarner');
    }

    if (config.killEarnerEnabled) {
      await sails.hooks.economy.stop(server.id, 'killEarner');
    }
    // High ping kick
    await sails.hooks.highpingkick.stop(server.id);

    // Historical info (aka analytics)
    await sails.hooks.historicalinfo.stop(server.id, 'memUpdate');

    // SdtdCommands
    await sails.hooks.sdtdcommands.stop(server.id);

    // Logs
    await sails.hooks.sdtdlogs.stop(server.id);

    await SdtdConfig.update({
      server: server.id
    }, {
      inactive: true
    });
    sails.log.info(`Server has been marked as inactive.`, _.omit(server, 'authName', 'authToken'));
    return exits.success();

  }


};
