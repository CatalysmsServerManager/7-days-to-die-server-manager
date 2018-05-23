module.exports = {


  friendlyName: 'Disable notifications',


  description: '',


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


    await CronJob.update({ id: inputs.jobId }, { notificationEnabled: false });
    sails.log.debug(`Disabled notifications for job ${inputs.jobId}`);

    return exits.success();

  }


};
