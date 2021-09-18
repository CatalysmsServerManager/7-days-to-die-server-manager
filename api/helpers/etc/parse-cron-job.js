module.exports = {


  friendlyName: 'Parse cron job',


  description: '',


  inputs: {

    jobId: {
      type: 'number',
      required: true,
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

      const dateStarted = Date.now();
      sails.log.debug(`Executing a cron job for server ${foundJob.server.name}`, {server: foundJob.server});
      let responses = await sails.helpers.sdtd.executeCustomCmd(foundJob.server, foundJob.command);

      foundJob.responses = responses;
      const dateEnded = Date.now();
      sails.log.debug(`Executed a cron job for server ${foundJob.server.name} - took ${dateEnded - dateStarted} ms`, {server: foundJob.server});

      if (foundJob.notificationEnabled) {
        await sails.helpers.discord.sendNotification({
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
