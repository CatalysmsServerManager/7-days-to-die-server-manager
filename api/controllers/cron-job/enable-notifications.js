module.exports = {


  friendlyName: 'Enable notifications',


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

    await CronJob.update({ id: inputs.jobId }, { notificationEnabled: true });
    sails.log.info(`Enabled notifications for job ${inputs.jobId}`);

    return exits.success();

  }


};
