const validator = require('validator');
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
      description: "Must give either listing or server ID",
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
      JSON.parse(inputs.file)
    } catch (error) {
      return exits.invalidInput(`Malformed JSON - ${error}`)
    }

    let newData = JSON.parse(inputs.file);
    let allowedCommands = await sails.helpers.sdtd.getAllowedCommands(server);

    let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({
      serverId: server.id
    });
    let maxCustomCommands = sails.config.custom.donorConfig[donatorRole].maxCustomCommands;

    if (newData.length >= maxCustomCommands) {
      problems.push(`Too many commands, you are allowed ${maxCustomCommands}`)
    }



    for (const newCommand of newData) {

      if (newCommand.name.includes(' ')) {
        problems.push('Name cannot have spaces');
      }

      let commandsToExecute = newCommand.commandsToExecute.split(';');

      // Check if we can execute the entered commands
      commandsToExecute.forEach(command => {
        let splitMessage = command.split(' ');
        let idx = allowedCommands.findIndex(serverCommand => serverCommand == splitMessage[0]);
        if (idx === -1) {
          problems.push(`${splitMessage[0]} is not a valid command.`);
        }
      });

      if (!_.isBoolean(newCommand.enabled)) {
        problems.push(`Enabled must be true or false.`)
      }

      if (!validator.isInt(newCommand.delay + '', {
          min: 0
        })) {
        problems.push(`${newCommand.delay} is not a valid delay.`)
      }

      if (!validator.isInt(newCommand.timeout + '', {
          min: 0
        })) {
        problems.push(`${newCommand.timeout} is not a valid timeout.`)
      }

      if (!validator.isInt(newCommand.costToExecute + '', {
          min: 0
        })) {
        problems.push(`${newCommand.costToExecute} is not a valid costToExecute.`)
      }

    }

    if (problems.length === 0) {

        await CustomCommandArgument.destroy({server: inputs.serverId})

      await CustomCommand.destroy({
        server: inputs.serverId
      });
      let createdRecords = await CustomCommand.createEach(newData.map(newCommand => {
        newCommand.server = inputs.serverId
        return _.omit(newCommand, "arguments")
      }));
      sails.log.info(`Imported ${newData.length} commands for server ${inputs.serverId}`);
      return exits.success()
    } else {
      return exits.invalidInput(problems)
    }


  }


};
