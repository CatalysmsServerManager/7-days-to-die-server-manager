module.exports = {


  friendlyName: 'Create',


  description: 'Create cron job.',


  inputs: {

    serverId: {
      required: true,
      type: 'number',
      custom: async function (valueToCheck) {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer;
      }
    },

    command: {
      required: true,
      type: 'string'
    },

    temporalValue: {
      type: 'string',
      custom: function (valueToCheck) {
        const cronParser = require('cron-parser');

        const interval = cronParser.parseExpression(valueToCheck);

        let prevDate = interval.prev().toDate();
        let nextDate = interval.next().toDate();

        return (prevDate.valueOf() + 300000) < nextDate.valueOf()

      }
    },

    minutes: {
      type: 'number',
      min: 5,
      max: 59
    },

    hours: {
      type: 'number',
      min: 1,
      max: 24
    }

  },


  exits: {

    success: {
      responseType: '',
      statusCode: 200
    },

    badCommand: {
      statusCode: 400
    },

    maxJobs: {
      statusCode: 400
    },

    badInput: {
      statusCode: 400
    }

  },


  fn: async function (inputs, exits) {

    if (!(inputs.temporalValue || inputs.minutes || inputs.hours)) {
      return exits.badInput(`Invalid time input. You must specify at least one.`);
    }

    let server = await SdtdServer.findOne(inputs.serverId);
    let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({ serverId: server.id });

    let maxCronJobs = sails.config.custom.donorConfig[donatorRole].maxCronJobs;
    let serverCronJobs = await CronJob.find({ server: server.id });

    if (serverCronJobs.length >= maxCronJobs) {
      return exits.maxJobs(`You have set the max number of jobs already. You have ${serverCronJobs.length} jobs and are allowed ${maxCronJobs}`)
    }

    // Parse hours or minutes for users who can't read documentation ^_^
    if (inputs.hours) {
      inputs.temporalValue = `0 */${inputs.hours} * * *`
    }

    if (inputs.minutes) {
      inputs.temporalValue = `*/${inputs.minutes} * * * *`
    }


    let createdJob = await CronJob.create({
      command: inputs.command,
      temporalValue: inputs.temporalValue,
      server: inputs.serverId
    }).fetch();

    await sails.hooks.cron.start(createdJob.id);

    sails.log.info(`Created a cron job`, createdJob);

    return exits.success(createdJob);

  }


};
