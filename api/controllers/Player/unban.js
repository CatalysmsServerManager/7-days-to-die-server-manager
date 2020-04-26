var sevenDays = require('7daystodie-api-wrapper');

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

      sails.log.debug(`API - Player:unban - unbanning player ${inputs.playerId}`);

      let player = await Player.findOne(inputs.playerId).populate('server');;

      if (!player) {
        return exits.notFound('Cannot unban player, invalid ID given!');
      }

      let server = await SdtdServer.findOne(player.server);

      await sevenDays.executeConsoleCommand(
        SdtdServer.getAPIConfig(server),
        `ban remove ${player.id}`
      );

      sails.log.info(`API - Player:unban - unbanning player from ${inputs.serverId}`, player);
      return exits.success(response);
    } catch (error) {
      sails.log.error(`API - Player:unban - ${error}`);
      return exits.error(error);
    }




  }
};
