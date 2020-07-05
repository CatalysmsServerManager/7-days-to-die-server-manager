module.exports = {


  friendlyName: 'Test',


  description: 'Test cron job.',

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

    let functionToExecute = await sails.helpers.etc.parseCronJob(inputs.jobId);

    let response = await functionToExecute();

    return exits.success(response);

  }


};
