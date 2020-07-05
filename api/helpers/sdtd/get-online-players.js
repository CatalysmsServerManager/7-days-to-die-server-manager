var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {


  friendlyName: 'Get online players',


  description: '',


  inputs: {

    serverId: {
      type: 'number',
      required: true,
      description: 'Id of the server',
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
    }
  },

  fn: async function (inputs, exits) {
    let server = await SdtdServer.findOne({ id: inputs.serverId });
    sevenDays.getOnlinePlayers({
      ip: server.ip,
      port: server.webPort,
      authName: server.authName,
      authToken: server.authToken,
    }).exec({
      success: response => {
        return exits.success(response);
      },
      error: err => {
        sails.log.warn(`Error getting online players for server ${server.name} - ${err}`);
        return exits.success([]);
      }
    });



  }


};



