module.exports = {


  friendlyName: 'Parse cron job',


  description: '',


  inputs: {

    jobId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundJob = await CronJob.findOne(valueToCheck);
        return foundJob;
      }
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {


    let functionToExecute = async () => {

      let foundJob = await CronJob.findOne(inputs.jobId).populate('server');

      if (!foundJob) {
        return;
      }

      let commandsToExecute = foundJob.command.split(';');
      const dateStarted = Date.now();
      sails.log.debug(`Executing a cron job for server ${foundJob.server.name}`, _.omit(foundJob, 'server'));
      let responses = await sails.helpers.sdtd.executeCustomCmd(foundJob.server, commandsToExecute);

      foundJob.responses = responses;
      const dateEnded = Date.now();
      sails.log.debug(`Executed a cron job for server ${foundJob.server.name} - took ${dateEnded - dateStarted} ms`, _.omit(foundJob, 'server'));

      if (foundJob.notificationEnabled) {
        await sails.hooks.discordnotifications.sendNotification({
          serverId: foundJob.server.id,
          job: foundJob,
          notificationType: 'cronjob'
        });
      }


    };


    // All done.
    return exits.success(functionToExecute);

  }


};
