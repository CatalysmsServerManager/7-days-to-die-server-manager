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

  },

  /**
   * @memberof module:Player
   * @method profile
   * @description Serves the player profile view
   * @param {number} playerId
   */

  fn: async function (inputs, exits) {

    let player = await Player.findOne(inputs.playerId);
    let server = await SdtdServer.findOne(player.server);

    try {

      let historicalInfo = await HistoricalInfo.find({
        player: player.id,
        server: server.id
      })
      player = await sails.helpers.sdtd.loadPlayerData(server.id, player.steamId, false, true);
      player = player[0]
      try {
        const hhmmss = require('@streammedev/hhmmss')
        Object.defineProperty(player, 'playtimeHHMMSS', {
          value: hhmmss(player.playtime)
        })
      } catch (error) {
        sails.log.error(`Error calculating player playtime`, player)
      }

      let bans = await BanEntry.find({steamId: player.steamId});

      sails.log.info(`Loading player profile ${player.id} - ${player.name} for server ${server.name}`)

      return exits.success({
        player: player,
        server: server,
        historicalInfo: historicalInfo,
        bans: bans
      });
    } catch (error) {
      sails.log.error(`VIEW - Player:profile - ${error}`);
      throw 'notFound';
    }


  }
};
