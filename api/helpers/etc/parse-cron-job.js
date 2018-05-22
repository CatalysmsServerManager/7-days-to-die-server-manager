const sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {


  friendlyName: 'Parse cron job',


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

    let foundJob = await CronJob.findOne(inputs.jobId).populate('server');

    let functionToExecute = async () => {
      sevenDays.executeCommand({
        ip: foundJob.server.ip,
        port: foundJob.server.webPort,
        authName: foundJob.server.authName,
        authToken: foundJob.server.authToken,
        command: foundJob.command
      }).exec({
        success: function (data) {
          return data
        },
        error: err => {
          return err
        }
      })
    }

    // All done.
    return exits.success(functionToExecute);

  }


};

