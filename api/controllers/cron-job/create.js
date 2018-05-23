module.exports = {


  friendlyName: 'Create',


  description: 'Create cron job.',


  inputs: {

    serverId: {
      required: true,
      type: 'number',
      custom: async function(valueToCheck) {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer 
      }
    },

    command: {
      required: true,
      type: 'string'
    },

    temporalValue: {
      required: true,
      type: 'string',
      custom: function(valueToCheck) {
        const cronParser = require('cron-parser');

        const interval = cronParser.parseExpression(valueToCheck);

        let prevDate = interval.prev().toDate();
        let nextDate = interval.next().toDate();

        return (prevDate.valueOf() + 300000) < nextDate.valueOf()

      }
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

  },


  fn: async function (inputs, exits) {

    let server = await SdtdServer.findOne(inputs.serverId);
    let allowedCommands = await sails.helpers.sdtd.getAllowedCommands(server);
    let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({ serverId: server.id });

    let maxCronJobs = sails.config.custom.donorConfig[donatorRole].maxCronJobs;
    let serverCronJobs = await CronJob.find({server: server.id});

    if (serverCronJobs.length >= maxCronJobs) {
      return exits.maxJobs(`You have set the max number of jobs already. You have ${serverCronJobs.length} jobs and are allowed ${maxCronJobs}`)
    }
    

    let splitCommand = inputs.command.split(' ');

    let commandIdx = allowedCommands.indexOf(splitCommand[0]);

    if (commandIdx === -1) {
      return exits.badCommand(new Error('Invalid command'));
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
