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
    const player = await Player.findOne(inputs.playerId).populate('server');
    const server = await SdtdServer.findOne(player.server.id);

    sails.log.debug(`API - Player:unban - unbanning player ${inputs.playerId}`, {playerId: inputs.playerId, serverid: server.id});
    const response = await sails.helpers.sdtdApi.executeConsoleCommand(
      SdtdServer.getAPIConfig(server),
      `ban remove ${player.entityId}`
    );

    return exits.success(response);
  }
};
