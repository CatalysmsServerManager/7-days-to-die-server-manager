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
    notAuthorized: {
      description: 'user is not authorized to do this.',
      responseType: 'view',
      viewTemplatePath: 'meta/notauthorized'
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

    const server = await SdtdServer.findOne(inputs.serverId);
    const serverConfig = await SdtdConfig.findOne({
      server: server.id
    });
    const user = await User.findOne(this.req.session.userId);

    const gimmeItems = await GimmeItem.find({
      server: server.id
    });
    // Force a recheck of the CPM version in the cache
    sails.helpers.sdtd.checkCpmVersion(server.id, true).then(r => {
      // This is just to make sure the function is actually executed. Thanks sails
    });

    try {

      let customCommands = await CustomCommand.find({
        server: server.id,
      }).populate('arguments');
      sails.log.info(`VIEW - SdtdServer:settings - Showing settings for ${server.name} to user ${user.username}`);
      return exits.success({
        server: server,
        config: serverConfig,
        user: user,
        customCommands: customCommands,
        gimmeItems: gimmeItems,
        serverTime: Date.now()
      });
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:settings - ${error}`);
      throw 'notFound';
    }


  }
};
