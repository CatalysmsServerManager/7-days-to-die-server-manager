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
          return undefined
        })
        .tolerate('connectionRefused', error => {
          return undefined
        })

      if (!_.isUndefined(sdtdServerInfo)) {
        sdtdServer = sdtdServerInfo;
      }

      let allocsVersion = await sails.helpers.sdtd.checkModVersion('Mod Allocs MapRendering and Webinterface', sdtdServer.id);
      let cpmVersion = await sails.helpers.sdtd.checkModVersion('Mod CSMM Patrons', sdtdServer.id);

      let allocsObj = {
        supportedAllocs: sails.config.custom.currentAllocs,
        installedAllocs: allocsVersion
      }

      let cpmObj = {
        supportedCpm: sails.config.custom.currentCpm,
        installedCpm: cpmVersion
      }

      sails.log.info(`VIEW - SdtdServer:dashboard - Showing dashboard for ${sdtdServer.name} to user ${this.req.session.userId}`);
      return exits.success({
        server: sdtdServer,
        allocsVersion: allocsObj,
        cpmVersion: cpmObj
      });
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:dashboard - ${error}`);
      throw 'notFound';
    }


  }
};
