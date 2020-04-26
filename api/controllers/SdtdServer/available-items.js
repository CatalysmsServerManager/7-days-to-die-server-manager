const sevenDays = require('7daystodie-api-wrapper');

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

      const response = await sevenDays.executeConsoleCommand(SdtdServer.getAPIConfig(server), `listitems ${inputs.item || '*'}`);

      let items = new Array();

      let splitResult = response.result.split(/\r?\n/)

      splitResult.forEach((element) => {
        element = element.trim()
        items.push(element);
      })
      items = items.slice(0, items.length-2);
      return exits.success(items);

    } catch (error) {
      sails.log.error(`API - SdtdServer:available-items - ${error}`);
      return exits.error(error);
    }

  }


};
