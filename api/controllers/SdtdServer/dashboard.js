module.exports = {

  friendlyName: 'Dashboard',

  description: 'Show the dashboard of a 7 Days to Die server',

  inputs: {
    serverId: {
      description: 'The ID of the server to look up.',
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'sdtdServer/dashboard'
    },
    notFound: {
      description: 'No server with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },

  /**
   * @memberof SdtdServer
   * @name dashboard
   * @method
   * @description Serves the dashboard for a 7 Days to die server
   */

  fn: async function (inputs, exits) {
    try {
      let sdtdServer = await SdtdServer.findOne(inputs.serverId);
      sdtdServerInfo = await sails.helpers.loadSdtdserverInfo(inputs.serverId)
        .tolerate('unauthorized', (error) => {
          sails.log.warn(`VIEW - SdtdServer:dashboard - unauthorized for server cannot load serverInfo ${inputs.serverId}`)
        })
        .tolerate('connectionRefused', error => {
            return undefined
        })

      if (!_.isUndefined(sdtdServerInfo)) {
        sdtdServer = sdtdServerInfo;
      }
      let players = await sails.helpers.sdtd.loadPlayerData.with({serverId:inputs.serverId, onlyOnline: true})
        .tolerate('unauthorized', (error) => {
          sails.log.warn(`VIEW - SdtdServer:dashboard - unauthorized for server cannot load playerInfo ${inputs.serverId}`)
        })
        .tolerate('connectionRefused', error => {
          return undefined
        })
        sails.log.info(`VIEW - SdtdServer:dashboard - Showing dashboard for ${sdtdServer.name}`);
      return exits.success({
        server: sdtdServer,
        players: players
      });
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:dashboard - ${error}`);
      throw 'notFound';
    }


  }
};
