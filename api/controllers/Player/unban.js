var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {

  friendlyName: 'Unban player',

  description: 'Unban a player from the server',

  inputs: {
    playerId: {
      description: 'The ID of the player',
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {},
    notFound: {
      description: 'No player with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },

  /**
   * @memberof Player
   * @method unban
   * @description unban a player
   * @param {string} steamId  Steam ID of the player
   * @param {string} serverId  ID of the server
   */

  fn: async function (inputs, exits) {

    try {

      let player = await Player.findOne(inputs.playerId).populate('server');
      let server = await SdtdServer.findOne(player.server.id);
      sails.log.debug(`API - Player:unban - unbanning player ${inputs.playerId}`, {player, server});
      return sevenDays.unbanPlayer({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        playerId: player.steamId,
      }).exec({
        error: function (error) {
          return exits.error(error);
        },
        unknownPlayer: function () {
          return exits.notFound('Cannot unban player, invalid ID given!');
        },
        success: function (response) {
          return exits.success(response);
        }
      });

    } catch (error) {
      sails.log.error(`API - Player:unban - ${error}`, {playerId: inputs.playerId});
      return exits.error(error);
    }




  }
};
