var sevenDays = require('machinepack-7daystodiewebapi');

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
  return new Promise(resolve => {
    sevenDays.getStats({
      ip: sdtdServer.ip,
      port: sdtdServer.webPort,
      authName: sdtdServer.authName,
      authToken: sdtdServer.authToken
    }).exec({
      success: (response) => {

        if (!response) {
          return resolve(false);
        }

        if (response.gametime) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      },
      error: (error) => {
        return resolve(false);
      },
      connectionRefused: error => {
        return resolve(false);
      }
    });
  });
}

async function checkCommand(sdtdServer) {
  return new Promise(resolve => {
    let statsResponse = sevenDays.executeCommand({
      ip: sdtdServer.ip,
      port: sdtdServer.webPort,
      authName: sdtdServer.authName,
      authToken: sdtdServer.authToken,
      command: 'help'
    }).exec({
      success: (response) => {
        resolve(true);
      },
      error: (error) => {
        resolve(false);
      },
      connectionRefused: error => {
        resolve(false);
      }
    });
  });
}
