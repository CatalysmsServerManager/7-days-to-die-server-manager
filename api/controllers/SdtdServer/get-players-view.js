module.exports = {
  friendlyName: 'Get players view',
  description: 'Load the player overview view',

  inputs: {
    serverId: {
      required: true,
      example: 4
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'sdtdServer/players'
    },

    notAuthorized: {
      description: 'user is not authorized to do this.',
      responseType: 'view',
      viewTemplatePath: 'meta/notauthorized'
    }

  },

  /**
   * @memberof SdtdServer
   * @name get-players-view
   * @method
   * @description Serve the players views
   * @param {number} serverId ID of the server
   */


  fn: async function (inputs, exits) {
    const defaultRole = await sails.helpers.roles.getDefaultRole(inputs.serverId);
    const server = await SdtdServer.findOne(inputs.serverId);
    try {
      sails.log.info(`VIEW - SdtdServer:players - Showing players for ${server.name}`);

      exits.success({
        server: server,
        defaultRole: defaultRole
      });
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:players - ${error}`);
    }

  }


};
