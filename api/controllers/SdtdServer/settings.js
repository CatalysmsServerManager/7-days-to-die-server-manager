module.exports = {

  friendlyName: 'Settings',

  description: 'Show the settings for a server view',

  inputs: {
    serverId: {
      description: 'The ID of the server',
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'sdtdServer/settings'
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
   * @name settings
   * @method
   * @description Serves the settings view
   * @param {number} serverId ID of the server
   */

  fn: async function (inputs, exits) {

    if (_.isUndefined(this.req.signedCookies.userProfile)) {
      throw 'notLoggedIn';
    }

    sails.log.debug(`VIEW - SdtdServer:settings - Showing settings for ${inputs.serverId}`);

    try {
      let server = await SdtdServer.findOne(inputs.serverId);
      let serverConfig = await SdtdConfig.findOne({server: server.id});
      return exits.success({
        server: server,
        config: serverConfig
      });
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:settings - ${error}`);
      throw 'notFound';
    }


  }
};
