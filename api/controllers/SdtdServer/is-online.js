var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {

  friendlyName: 'is online',

  description: 'Check if a server is online or not',

  inputs: {

    serverId: {
      description: 'Id of the SdtdServer',
      type: 'number',
      required: true
    }

  },

  exits: {

    success: {},


  },

  /**
     * @memberof SdtdServer
     * @name is-online
     * @method
     * @description Check if a server is online & available
     * @param {string} serverId ID of the server
     */

  fn: async function (inputs, exits) {

    let sdtdServer = await SdtdServer.findOne(inputs.serverId);

    if (!sdtdServer) {
      return exits.success(false);
    }

    sevenDays.getStats({
      ip: sdtdServer.ip,
      port: sdtdServer.webPort,
      authName: sdtdServer.authName,
      authToken: sdtdServer.authToken
    }).exec({
      success: (response) => {
        if (!response) {
          return exits.success(false);
        }
        if (response.gametime) {
          return exits.success(true);
        } else {
          return exits.success(false);
        }
      },
      error: (error) => {
        return exits.success(false);
      },
      connectionRefused: error => {
        return exits.success(false);
      }
    });



  }
};
