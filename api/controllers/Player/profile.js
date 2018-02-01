module.exports = {

  friendlyName: 'Player Profile',

  description: 'Show profile of a SdtdPlayer',

  inputs: {
    playerId: {
      description: 'The ID of the player',
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'player/profile'
    },
    notFound: {
      description: 'No player with the specified ID was found in the database.',
      responseType: 'notFound'
    },
    forbidden: {
      description: 'Someone who is not authorized tried to view this page',
      responseType: 'forbidden'
    }
  },

  /**
   * @memberof module:Player
   * @name profile
   * @description Serves the player profile view
   * @param {number} playerId
   */

  fn: async function (inputs, exits) {

    sails.log.debug(`VIEW - Player:profile - Showing profile for ${inputs.playerId}`);

    try {
      const userProfile = this.req.signedCookies.userProfile;
      let player = await Player.findOne(inputs.playerId);
      let server = await SdtdServer.findOne(player.server);
      await sails.helpers.loadPlayerData(server.id, player.steamId);
      player = await Player.findOne(inputs.playerId);

      return exits.success({
        player: player,
        server: server
      });
    } catch (error) {
      sails.log.error(`VIEW - Player:profile - ${error}`);
      throw 'notFound';
    }


  }
};
