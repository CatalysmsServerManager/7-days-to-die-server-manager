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

    
    let functionToExecute = async () => {
      
      let foundJob = await CronJob.findOne(inputs.jobId).populate('server');
      
      sevenDays.executeCommand({
        ip: foundJob.server.ip,
        port: foundJob.server.webPort,
        authName: foundJob.server.authName,
        authToken: foundJob.server.authToken,
        command: foundJob.command
      }).exec({
        success: async (data) => {
          await CronJob.update({id: foundJob.id}, {timesRan: foundJob.timesRan + 1});
          sails.log.debug(`Executed a cron job for server ${foundJob.server.name}`, foundJob);
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

