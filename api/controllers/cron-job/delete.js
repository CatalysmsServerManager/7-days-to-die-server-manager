module.exports = {


  friendlyName: 'Delete',


  description: 'Delete cron job.',


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
    
    await sails.hooks.cron.stop(inputs.jobId);
    await CronJob.destroy({id: inputs.jobId});
    sails.log.debug(`Deleted cron job ${inputs.jobId}`)
    return exits.success();

  }


};
