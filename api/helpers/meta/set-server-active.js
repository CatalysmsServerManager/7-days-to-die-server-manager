module.exports = {


  friendlyName: 'Set server active',


  description: 'Starts all hooks, timers, modules for a server that was inactive',


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
    const cronJobs = await CronJob.find({
      server: server.id,
      enabled: true
    });


    await sails.hooks.sdtdlogs.start(server.id);

    // Country ban
    if (config.countryBanConfig.enabled) {
      await sails.hooks.countryban.start(server.id);
    }

    // Cron
    for (const jobToStart of cronJobs) {
      try {
        await sails.hooks.cron.start(jobToStart.id);
      } catch (error) {
        sails.log.error(`Error initializing cronjob ${jobToStart.id} - ${error}`)
      }
    }

    // Chatbridge
    if (config.chatChannelId) {
      await sails.hooks.discordchatbridge.start(server.id);
    }

    // Custom hooks
    await sails.hooks.customhooks.start(server.id);

    // Economy  

    if (config.playtimeEarnerEnabled) {
      await sails.hooks.economy.start(server.id, 'playtimeEarner');
    }

    if (config.discordTextEarnerEnabled) {
      await sails.hooks.economy.start(server.id, 'discordTextEarner');
    }

    if (config.killEarnerEnabled) {
      await sails.hooks.economy.start(server.id, 'killEarner');
    }

    await SdtdConfig.update({
      server: server.id
    }, {
      inactive: false
    });
    sails.log.info(`Server has been marked as active.`, _.omit(server, 'authName', 'authToken'));

    return exits.success();
  }


};
