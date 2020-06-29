const sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {


  friendlyName: 'Get available items',


  description: 'Returns a list of items on the server',


  inputs: {
    serverId: {
      required: true,
      example: 4
    },
    item: {
      type: 'string',
      example: 'stew'
    }

  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    },
    notFound: {
      responseType: 'notFound',
      description: 'Server was not found in DB'
    }
  },

  /**
     * @memberof SdtdServer
     * @method
     * @name available-items
     * @description Returns a list of items on the server
     * @param {number} serverId ID of the server
     * @returns {array}
     */

  fn: async function (inputs, exits) {
    sails.log.debug(`API - SdtdServer:available-items - Loading available items!`);
    try {
      let server = await SdtdServer.findOne({
        id: inputs.serverId
      });

      if (_.isUndefined(server)) {
        return exits.notFound();
      }

      sevenDays.listItems({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        itemToSearch: inputs.item
      }).exec({
        success: (response) => {
          if (!response) {
            return exits.success([])
          }
          return exits.success(response);
        },
        unknownCommand: (error) => {
          return exits.commandError(error);
        },
        error: (error) => {
          return exits.error(error);
        }
      });

    } catch (error) {
      sails.log.error(`API - SdtdServer:available-items - ${error}`);
      return exits.error(error);
    }

  }


};
