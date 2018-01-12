var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {


  friendlyName: 'Load sdtdServer info',


  description: 'Performs several API requests to a sdtd server',


  inputs: {
    serverId: {
      friendlyName: 'Server ID',
      required: true,
      example: 1
    }
  },


  exits: {
    success: {
      outputFriendlyName: 'Success'
    },
    connectionError: {
      description: 'Could not connect to the 7 days to die server'
    },
    databaseError: {
      description: 'Error reading or writing data to DB'
    }
  },

    /**
     * @description Loads server information
     * @name loadSdtdServerInfo
     * @param {number} serverId
     * @memberof module:Helpers
     * @method
     */


  fn: async function (inputs, exits) {

    try {
      sails.log.debug(`HELPER - loadSdtdserverInfo - Loading server info for server ${inputs.serverId}`)
      // Load serverinfo from DB first
      let server = await SdtdServer.findOne(inputs.serverId);
      server.stats = await loadStats(server)
      server.serverInfo = await loadServerInfo(server)
      exits.success(server)
    } catch (error) {
      return exits.error(error)
    }


    function loadStats(server) {
      return new Promise((resolve, reject) => {
        sevenDays.getStats({
          ip: server.ip,
          port: server.webPort,
          authName: server.authName,
          authToken: server.authToken
        }).exec({
          error: error => {
            sails.log.error(error);
            reject(error);
          },
          success: data => {
            resolve(data)
          }
        })
      })
    }

    function loadServerInfo(server) {
      return new Promise((resolve, reject) => {
        sevenDays.getServerInfo({
          ip: server.ip,
          port: server.webPort,
          authName: server.authName,
          authToken: server.authToken
        }).exec({
          error: error => {
            sails.log.error(error);
            reject(error);
          },
          success: data => {
              for (const dataPoint in data) {
                  if (data.hasOwnProperty(dataPoint)) {
                      data[dataPoint] = data[dataPoint].value
                  }
              }
            resolve(data)
          }
        })
      })
    }


  }


};
