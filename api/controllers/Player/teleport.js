const sevenDays = require('7daystodie-api-wrapper');

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
    },
    unknownPlayer: {
      description: "The given player id is not valid",
      responseType: 'ok'
    },
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

    try {

      sails.log.debug(`API - Player:teleport - teleporting player ${inputs.playerId}`);

      let player = await Player.findOne(inputs.playerId).populate('server');
      let server = player.server;

      const response = await sevenDays.executeConsoleCommand(SdtdServer.getAPIConfig(server),  `tele ${player.steamId} ${inputs.coordX} ${inputs.coordY} ${inputs.coordZ}`)
      if (response.result.includes('Playername or entity/steamid id not found.')) {
        return exits.unknownPlayer("Playername or entity/steamid id not found.")
      }
      sails.log.debug(`API - Player:teleport - Successfully teleported player ${inputs.playerId} to ${inputs.coordX} ${inputs.coordY} ${inputs.coordZ}`);
      return exits.success();
    } catch (error) {
      sails.log.error(`API - Player:teleport`, error);
      return exits.error(error);
    }
  }
};
