const cronParser = require('cron-parser');

module.exports = {


  friendlyName: 'Cron export',


  description: '',


  inputs: {
    serverId: {
      type: 'number'
    },
    file: {
      type: 'ref'
    },

  },


  exits: {
    success: {},

    invalidIds: {
      description: 'Must give either listing or server ID',
      responseType: 'badRequest',
      statusCode: 400
    },

    invalidInput: {
      responseType: 'badRequest',
      statusCode: 400
    }
  },


  fn: async function (inputs, exits) {
    let problems = new Array();
    let server = await SdtdServer.findOne(inputs.serverId);
    try {
      JSON.parse(inputs.file);
    } catch (error) {
      return exits.invalidInput(`Malformed JSON - ${error}`);
    }

    let newData = JSON.parse(inputs.file);

    let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({ serverId: server.id });
    let maxCronJobs = sails.config.custom.donorConfig[donatorRole].maxCronJobs;

    if (newData.length >= maxCronJobs) {
      problems.push(`Too many cron jobs, you are allowed ${maxCronJobs}`);
    }



    for (const newCron of newData) {
      let interval;

      try {
        interval = cronParser.parseExpression(newCron.temporalValue);
      } catch (error) {
        problems.push(`Invalid temporal value, syntax error - ${error}`);
      }

      if (interval) {
        let prevDate = interval.prev().toDate();
        let nextDate = interval.next().toDate();

        if (!((prevDate.valueOf() + 300000) < nextDate.valueOf())) {
          problems.push(`Invalid temporal value, must be 5 minutes apart ${newCron.temporalValue}`);
        }
      }

      if (!_.isBoolean(newCron.enabled)) {
        problems.push(`Invalid "enabled" must be true or false - ${newCron.enabled}`);
      }

      if (!_.isBoolean(newCron.notificationEnabled)) {
        problems.push(`Invalid "notificationEnabled" must be true or false - ${newCron.notificationEnabled}`);
      }

    }

    if (problems.length === 0) {

      await CronJob.destroy({ server: inputs.serverId });
      await CronJob.createEach(newData.map(newCron => {
        newCron.server = inputs.serverId;
        return newCron;
      }));
      sails.log.info(`Imported ${newData.length} cron jobs for server ${inputs.serverId}`, {serverId: inputs.serverId});
      return exits.success();
    } else {
      return exits.invalidInput(problems);
    }


  }


};
