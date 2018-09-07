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

    
    let server = await SdtdServer.findOne(inputs.serverId);

    let permCheck = await sails.helpers.roles.checkPermission.with({
      userId: this.req.session.userId,
      serverId: inputs.serverId,
      permission: 'managePlayers'
    });

    if (!permCheck.hasPermission) {
      return exits.notAuthorized({
        role: permCheck.role,
        requiredPerm: 'managePlayers'
      })
    }

    try {
      let players = await Player.find({server: server.id}).populate('role');

      players.map(player => {
        const hhmmss = require('@streammedev/hhmmss')
        let newPlaytime = hhmmss(player.playtime);
        player.playtimeHHMMSS = newPlaytime;
        return player;
      });

      sails.log.info(`VIEW - SdtdServer:players - Showing players for ${server.name} - ${players.length} players`);

      exits.success({
        players: players,
        server: server
      });
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:players - ${error}`);
    }

  }


};
