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

    const server = await SdtdServer.findOne(inputs.serverId);
    if (_.isUndefined(server)) {
      return exits.error('Unknown server ID');
    }
    const cronJobs = await CronJob.find({server: server.id, enabled: true});

    await sails.hooks.countryban.stop(server.id);

    for (const jobToStop of cronJobs) {
      try {
        await sails.hooks.cron.stop(jobToStop.id);
      } catch (error) {
        sails.log.error(`Error initializing cronjob ${jobToStop.id} - ${error}`)               
      }
    }

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
