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
    let deletedJob = await CronJob.destroy({id: inputs.jobId}).fetch();
    sails.log.info(`Deleted cron job ${inputs.jobId}`)
    return exits.success(deletedJob);

  }


};
