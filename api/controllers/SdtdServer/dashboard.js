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
    },
    badRequest: {
      responseType: 'badRequest'
    },

  },

  /**
   * @memberof SdtdServer
   * @name dashboard
   * @method
   * @description Serves the dashboard for a 7 Days to die server
   */

  fn: async function (inputs, exits) {

    let sdtdServer = await SdtdServer.findOne(inputs.serverId);


    try {

      sdtdServerInfo = await sails.helpers.loadSdtdserverInfo(inputs.serverId)
        .tolerate('unauthorized', (error) => {
          sails.log.warn(`VIEW - SdtdServer:dashboard - unauthorized for server cannot load serverInfo ${inputs.serverId}`);
          return exits.badRequest(error);
        })
        .tolerate('connectionRefused', error => {
          return exits.badRequest(error);
        });

      const config = await SdtdConfig.findOne({ server: inputs.serverId });

      if (!_.isUndefined(sdtdServerInfo)) {
        sdtdServer = sdtdServerInfo;
      }

      let userRole = await sails.helpers.roles.getUserRole(this.req.session.user.id, sdtdServer.id);

      sails.log.info(`VIEW - SdtdServer:dashboard - Showing dashboard for ${sdtdServer.name} to user ${this.req.session.userId}`);
      return exits.success({
        server: sdtdServer,
        config: config,
        userRole: userRole,
        owner: sdtdServer.owner === parseInt(this.req.session.user.id) ? true : false
      });
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:dashboard - ${error}`);
      throw 'badRequest';
    }


  }
};
