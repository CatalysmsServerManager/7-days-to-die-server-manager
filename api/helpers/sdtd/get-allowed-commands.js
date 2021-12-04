module.exports = {


  friendlyName: 'Get allowed commands',


  description: '',


  inputs: {

    server: {
      type: 'ref',
      required: true,
      custom: (valueToCheck) => {
        return valueToCheck.ip && valueToCheck.webPort && valueToCheck.authName && valueToCheck.authToken;
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
    const response = await sails.helpers.sdtdApi.getAllowedCommands(SdtdServer.getAPIConfig(inputs.server));

    const allowedCommands = new Array();
    response.commands.forEach(command => {
      allowedCommands.push(command.command);
    });

    return exits.success(allowedCommands);

  }


};

