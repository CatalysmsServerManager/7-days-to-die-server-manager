var sevenDays = require('7daystodie-api-wrapper');

module.exports = {


  friendlyName: 'Get allowed commands',


  description: '',


  inputs: {

    server: {
      type: 'ref',
      required: true,
      custom: (valueToCheck) => {
        return valueToCheck.ip && valueToCheck.webPort && valueToCheck.authName && valueToCheck.authToken
      }
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Allowed commands',
      outputType: 'ref'
    },

  },


  fn: async function (inputs, exits) {
    try {
      const response = await sevenDays.getAllowedCommands(SdtdServer.getAPIConfig(inputs.server));
      const allowedCommands = response.commands.map(command => command.command);
      return exits.success(allowedCommands);
    } catch (error) {
      return exits.error(error);
    }
  }
};

