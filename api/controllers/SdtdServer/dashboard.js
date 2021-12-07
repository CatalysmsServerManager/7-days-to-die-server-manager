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

    let sdtdServerInfo = null;
    try {
      sdtdServerInfo = await sails.helpers.loadSdtdserverInfo(inputs.serverId);
    } catch (error) {
      sails.log.warn(error, {serverId: inputs.serverId});
    }

    const config = await SdtdConfig.findOne({ server: inputs.serverId });

    if (sdtdServerInfo) {
      sdtdServer = sdtdServerInfo;
    }

    let userRole = await sails.helpers.roles.getUserRole(this.req.session.user.id, sdtdServer.id);

    sails.log.info(`VIEW - SdtdServer:dashboard - Showing dashboard for ${sdtdServer.name} to user ${this.req.session.userId}`, {serverId: inputs.serverId});
    return exits.success({
      server: sdtdServer,
      config: config,
      userRole: userRole,
      owner: sdtdServer.owner === parseInt(this.req.session.user.id) ? true : false
    });

  }
};
