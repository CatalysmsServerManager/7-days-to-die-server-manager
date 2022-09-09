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
      defaultsTo: '*'
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
    sails.log.debug(`API - SdtdServer:available-items - Loading available items!`, { serverId: inputs.serverId });

    const server = await SdtdServer.findOne({
      id: inputs.serverId
    });

    if (_.isUndefined(server)) {
      return exits.notFound();
    }

    const cachedResult = await sails.helpers.redis.get(`server:${inputs.serverId}:availableItems`);

    if (cachedResult) {
      sails.log.debug(`API - SdtdServer:available-items - Using cached result!`, { serverId: inputs.serverId });
      return exits.success(JSON.parse(cachedResult));
    }

    const response = await sails.helpers.sdtdApi.executeConsoleCommand(
      SdtdServer.getAPIConfig(server),
      `listitems ${inputs.item}`,
      { timeout: 10000 }
    );

    items = response.result
      .split('\n')
      .map(function (item) {
        return item.trim();
      }).filter(Boolean)
      // Remove the last element, which is the total
      .slice(0, -1);

    await sails.helpers.redis.set(`server:${inputs.serverId}:availableItems`, JSON.stringify(items), true, 60 * 60 * 24);

    return exits.success(items);
  }
};
