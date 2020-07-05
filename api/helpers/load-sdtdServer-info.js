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

      // Load serverinfo from DB first
      let server = await SdtdServer.findOne(inputs.serverId);
      server.stats = await loadStats(server);
      server.serverInfo = await loadServerInfo(server);
      sails.log.debug(`HELPER - loadSdtdserverInfo - Loaded server info for server ${server.name}`);
      exits.success(server);
    } catch (error) {
      sails.log.warn(`HELPER - load-sdtdServer-info - Failed to load info ${error}`);
      return exits.error(error);
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
            resolve(undefined);
          },
          success: data => {
            resolve(data);
          }
        });
      });
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
            resolve(undefined);
          },
          success: data => {
            for (const dataPoint in data) {
              if (data.hasOwnProperty(dataPoint)) {
                data[dataPoint] = data[dataPoint].value;
              }
            }
            resolve(data);
          }
        });
      });
    }


  }


};
