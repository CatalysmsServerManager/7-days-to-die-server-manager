module.exports = {


  friendlyName: 'Check if available',


  description: 'Checks if a server can be reached via the web API',


  inputs: {

    serverId: {
      type: 'number',
      description: 'Id of the server',
      required: true
    },

    onlyStats: {
      type: 'boolean',
      defaultsTo: false,
      description: 'If true, only check via API response and skip command'
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'boolean'
    },
    notAvailable: {
      outputFriendlyName: 'Not available',
      description: 'The server could not be reached'
    }
  },

  /**
   * @description Checks if a server can be reached via the web API
   * @name checkIfAvailable
   * @memberof module:Helpers
   * @returns {boolean}
   * @method
   * @param {number} serverId
   */

  fn: async function (inputs, exits) {
    const sdtdServer = await SdtdServer.findOne({
      id: inputs.serverId
    });

    const statsResponse = await checkStats(sdtdServer);

    const commandResponse = true;
    if (!inputs.onlyStats) {
      commandResponse = await checkCommand(sdtdServer);
    }

    if (statsResponse && commandResponse) {
      return exits.success(true);
    } else {
      return exits.success(false);
    }
  }
};

async function checkStats(server) {
  try {
    const response = await sails.helpers.sdtdApi.getStats(SdtdServer.getAPIConfig(server));

    if (!response) {
      return false;
    }

    if (response.gametime) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }

}

async function checkCommand(server) {
  try {
    await sails.helpers.sdtdApi.executeConsoleCommand(SdtdServer.getAPIConfig(server), 'version');
    return true;
  } catch (error) {
    return false;
  }

}
