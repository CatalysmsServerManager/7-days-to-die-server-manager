var sevenDays = require('machinepack-7daystodiewebapi');

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

    sevenDays.getAllowedCommands({
      ip: inputs.server.ip,
      port: inputs.server.webPort,
      authName: inputs.server.authName,
      authToken: inputs.server.authToken
    }).exec({
      error: error => {
        return exits.error(error);
      },
      success: response => {
        let allowedCommands = new Array();
        response.commands.forEach(command => {
          allowedCommands.push(command.command)
        })

        return exits.success(allowedCommands);
      }
    })




  }


};

