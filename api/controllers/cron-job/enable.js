module.exports = {


  friendlyName: 'Enable',


  description: 'Enable cron job.',


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

    await CronJob.update({ id: inputs.jobId }, { enabled: true });
    await sails.hooks.cron.start(inputs.jobId);
    sails.log.info(`Enabled cron job ${inputs.jobId}`);
    return exits.success();
  }


};
