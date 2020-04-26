var sevenDays = require('7daystodie-api-wrapper');

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
      sails.log.warn(`HELPER - load-sdtdServer-info - Failed to load info ${error}`)
      return exits.error(error);
    }


    async function loadStats(server) {
      try {
        return sevenDays.getStats(SdtdServer.getAPIConfig(server));
      } catch (error) {
        return undefined;
      }
    }

    async function loadServerInfo(server) {
      try {
        let data = await sevenDays.getServerInfo(SdtdServer.getAPIConfig(server))
        for (const dataPoint in data) {
          if (data.hasOwnProperty(dataPoint)) {
            data[dataPoint] = data[dataPoint].value;
          }
        }
        return data;
      } catch (error) {
        return undefined;
      }
    }
  }
};
