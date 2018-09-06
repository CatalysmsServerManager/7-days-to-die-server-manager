module.exports = {


  friendlyName: 'Get tracking view',


  inputs: {
    serverId: {
      required: true,
      example: 4,
    }
  },


  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'sdtdServer/tracking'
    },

    notAuthorized: {
      description: 'user is not authorized to do this.',
      responseType: 'view',
      viewTemplatePath: 'meta/notauthorized'
    }

  },


  fn: async function (inputs, exits) {

    let permCheck = await sails.helpers.roles.checkPermission.with({
      userId: this.req.session.userId,
      serverId: inputs.serverId,
      permission: 'useTracking'
    });

    if (!permCheck.hasPermission) {
      return exits.notAuthorized({
        role: permCheck.role,
        requiredPerm: 'useTracking'
      })
    }

    try {
      let server = await SdtdServer.findOne({
        id: inputs.serverId
      });
      let players = await Player.find({
        server: server.id
      });


      sails.log.info(`Showing tracking for ${server.name} - ${players.length} players`);

      exits.success({
        players: players,
        server: server
      });
    } catch (error) {
      sails.log.error(error);
    }

  }


};
