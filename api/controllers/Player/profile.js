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
   * @method profile
   * @description Serves the player profile view
   * @param {number} playerId
   */

  fn: async function (inputs, exits) {

    sails.log.debug(`VIEW - Player:profile - Showing profile for ${inputs.playerId}`);

    try {
      let player = await Player.findOne(inputs.playerId);
      let server = await SdtdServer.findOne(player.server);
      let historicalInfo = await HistoricalInfo.find({
        player: player.id,
        server: server.id
      })
      player = await sails.helpers.sdtd.loadPlayerData(server.id, player.steamId, false, true);
      player = player[0]
      const hhmmss = require('@streammedev/hhmmss')
      Object.defineProperty(player, 'playtimeHHMMSS', {
        value: hhmmss(player.playtime)
      })

      return exits.success({
        player: player,
        server: server,
        historicalInfo: historicalInfo
      });
    } catch (error) {
      sails.log.error(`VIEW - Player:profile - ${error}`);
      throw 'notFound';
    }


  }
};
