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
    notLoggedIn: {
      responseType: 'badRequest',
      description: 'User is not logged in (check signedCookies)'
    }
  },

  /**
   * @memberof SdtdServer
   * @name dashboard
   * @method
   * @description Serves the dashboard for a 7 Days to die server
   */

  fn: async function (inputs, exits) {

    if (_.isUndefined(this.req.signedCookies.userProfile)) {
      throw 'notLoggedIn';
    }

    sails.log.debug(`VIEW - SdtdServer:dashboard - Showing dashboard for ${inputs.serverId}`);

    try {
      let sdtdServer = await sails.helpers.loadSdtdserverInfo(inputs.serverId);
      let players = await sails.helpers.loadPlayerData.with({
        serverId: inputs.serverId
      });
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
