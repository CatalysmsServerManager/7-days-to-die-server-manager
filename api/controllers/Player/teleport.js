module.exports = {

  friendlyName: 'Teleport player',

  description: 'Teleport a player to given coordinates',

  inputs: {
    playerId: {
      description: 'The ID of the player',
      type: 'number',
      required: true
    },
    coordX: {
      description: 'X coordinate',
      type: 'number',
      required: true
    },
    coordY: {
      description: 'Y coordinate',
      type: 'number',
      required: true
    },
    coordZ: {
      description: 'Y coordinate',
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
   * @description ban a player
   * @method teleport
   * @param {string} playerId
   * @param {number} coordX
   * @param {number} coordY
   * @param {number} coordZ
   */

  fn: async function (inputs, exits) {
    sails.log.debug(`API - Player:teleport - teleporting player ${inputs.playerId}`, {playerId: inputs.playerId});

    const player = await Player.findOne(inputs.playerId).populate('server');
    const server = player.server;

    const response = await sails.helpers.sdtdApi.executeConsoleCommand(
      SdtdServer.getAPIConfig(server),
      `teleportplayer ${player.entityId} ${inputs.coordX} ${inputs.coordY} ${inputs.coordZ}`
    );

    return exits.success(response);
  }
};
