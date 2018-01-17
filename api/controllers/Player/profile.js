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
   * @memberof SdtdServer
   * @name console
   * @description Server the console view
   * @param {number} serverID ID of the server
   */

  fn: async function (inputs, exits) {

    sails.log.debug(`VIEW - Player:profile - Showing profile for ${inputs.playerId}`);

    try {
      const userProfile = this.req.signedCookies.userProfile;
      let player = await Player.findOne(inputs.playerId);
      let server = await SdtdServer.findOne(player.server)

      if (server.owner != userProfile.id) {
        sails.log.debug(`VIEW - Player:profile - User ${userProfile.id} tried to see a player but not authorized`);
        return exits.forbidden()
      }

      return exits.success({
        player: player
      });
    } catch (error) {
      sails.log.error(`VIEW - Player:profile - ${error}`);
      throw 'notFound';
    }


  }
};
