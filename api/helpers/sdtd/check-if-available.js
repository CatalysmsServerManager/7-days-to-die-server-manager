var sevenDays = require('7daystodie-api-wrapper');

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
      description: "If true, only check via API response and skip command"
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
    let sdtdServer = await SdtdServer.findOne({
      id: inputs.serverId
    });

    let statsResponse = await checkStats(sdtdServer);

    let commandResponse = true;
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

async function checkStats(sdtdServer) {
  try {
    const response = await sevenDays.getStats(SdtdServer.getAPIConfig(sdtdServer))
    if (response.gametime) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

async function checkCommand(sdtdServer) {
  try {
    let statsResponse = await sevenDays.executeConsoleCommand(SdtdServer.getAPIConfig(sdtdServer), 'help');
    return true;
  } catch (error) {
    return false;
  }
}
