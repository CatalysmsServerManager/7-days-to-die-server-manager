module.exports = {


  friendlyName: 'Edit',


  description: 'Edit cron job.',


  inputs: {
    jobId: {
      required: true,
      type: 'string'
    },

    command: {
      required: true,
      type: 'string',
      minLength: 3,
      maxLength: 50000,
    },

    temporalValue: {
      required: true,
      type: 'string',
      custom: function (valueToCheck) {
        const cronParser = require('cron-parser');

        const interval = cronParser.parseExpression(valueToCheck);

        let prevDate = interval.prev().toDate();
        let nextDate = interval.next().toDate();

        return (prevDate.valueOf() + 300000) < nextDate.valueOf();

      }
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    await sails.hooks.cron.stop(inputs.jobId);
    let editedCron = await CronJob.update({
      id: inputs.jobId
    }, {
      command: inputs.command,
      temporalValue: inputs.temporalValue
    }).fetch();

    await sails.hooks.cron.start(inputs.jobId);

    sails.log.info(`Edited a cron job with id ${inputs.jobId} to ${inputs.command} and ${inputs.temporalValue}`);
    return exits.success(editedCron);

  }


};
