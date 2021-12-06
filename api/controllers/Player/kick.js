module.exports = {

  friendlyName: 'Kick player',

  description: 'Kick a player from the server',

  inputs: {
    playerId: {
      description: 'The ID of the player',
      type: 'number',
      required: true
    },
    reason: {
      description: 'Reason the player gets kicked',
      type: 'string'
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
   * @description Kick a player
   * @method kick
   * @param {string} steamId  Steam ID of the player
   * @param {string} serverId  ID of the server
   */

  fn: async function (inputs, exits) {
    const player = await Player.findOne(inputs.playerId).populate('server');
    const server = await SdtdServer.findOne(player.server.id);
    const response = await sails.helpers.sdtdApi.executeConsoleCommand(
      SdtdServer.getAPIConfig(server),
      `kick ${player.entityId} "${inputs.reason}"`
    );

    return exits.success(response);
  }
};
