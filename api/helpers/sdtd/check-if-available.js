var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {


  friendlyName: 'Check if available',


  description: 'Checks if a server can be reached via the web API',


  inputs: {

    serverId: {
      type: 'number',
      description: 'Id of the server',
      required: true
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
    sails.log.debug(`HELPER - checkIfAvailable - checking if server ${inputs.serverId} is available`);

    try {
      let sdtdServer = await SdtdServer.findOne({
        id: inputs.serverId
      })
      let statsResponse = await checkStats(sdtdServer);
      let commandResponse = await checkCommand(sdtdServer);

      if (statsResponse && commandResponse) {
        return exits.success(true)
      } else {
        return exits.notAvailable()
      }

    } catch (error) {
      return exits.error(error)
    }


    async function checkStats(sdtdServer) {
      return new Promise(resolve => {
        let statsResponse = sevenDays.getStats({
          ip: sdtdServer.ip,
          port: sdtdServer.webPort,
          authName: sdtdServer.authName,
          authToken: sdtdServer.authToken
        }).exec({
          success: (response) => {
            resolve(true)
          },
          error: (error) => {
            resolve(false)
          }
        })
      })
    }

    async function checkCommand(sdtdServer) {
      return new Promise(resolve => {
        let statsResponse = sevenDays.executeCommand({
          ip: sdtdServer.ip,
          port: sdtdServer.webPort,
          authName: sdtdServer.authName,
          authToken: sdtdServer.authToken,
          command: 'mem'
        }).exec({
          success: (response) => {
            resolve(true)
          },
          error: (error) => {
            resolve(false)
          }
        })
      })
    }


  }


};
