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

    const sdtdServer = await SdtdServer.findOne(inputs.serverId);

    if (!sdtdServer) {
      return exits.success(false);
    }

    try {
      const response = await sails.helpers.sdtdApi.getStats(
        SdtdServer.getAPIConfig(sdtdServer),
      );
      if (response.gametime) {
        return exits.success(true);
      } else {
        return exits.success(false);
      }

    } catch (error) {
      return exits.success(false);
    }
  }
};
