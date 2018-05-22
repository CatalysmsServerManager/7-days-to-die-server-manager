module.exports = {


  friendlyName: 'Disable',


  description: 'Disable cron job.',

  inputs: {

    jobId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundJob = await CronJob.findOne(valueToCheck);
        return foundJob
      } 
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    await CronJob.update({id: inputs.jobId}, {enabled: false});
    await sails.hooks.cron.stop(inputs.jobId);
    sails.log.debug(`Disabled cron job ${inputs.jobId}`)
    return exits.success();

  }


};
