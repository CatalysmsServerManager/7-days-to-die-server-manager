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

    let server = await SdtdServer.findOne(inputs.serverId);
    let serverConfig = await SdtdConfig.findOne({
      server: server.id
    });
    let user = await User.findOne(this.req.session.userId);

    let cpmVersion;

    try {
      cpmVersion = await sails.helpers.sdtd.checkCpmVersion(inputs.serverId, true);
    } catch (error) {
      cpmVersion = 0;
    }


    let permCheck = await sails.helpers.roles.checkPermission.with({
      userId: this.req.session.userId,
      serverId: inputs.serverId,
      permission: 'manageServer'
    });

    if (!permCheck.hasPermission) {
      return exits.notAuthorized({
        role: permCheck.role,
        requiredPerm: 'manageServer'
      })
    }

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
        cpmVersion: cpmVersion
      });
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:settings - ${error}`);
      throw 'notFound';
    }


  }
};
