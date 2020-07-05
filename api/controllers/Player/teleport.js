const sevenDays = require('machinepack-7daystodiewebapi');

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

    try {

      sails.log.debug(`API - Player:teleport - teleporting player ${inputs.playerId}`);

      let player = await Player.findOne(inputs.playerId).populate('server');
      let server = player.server;

      sevenDays.teleportPlayer({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        playerId: player.steamId,
        coordinates: `${inputs.coordX} ${inputs.coordY} ${inputs.coordZ}`
      }).exec({
        success: () => {
          sails.log.debug(`API - Player:teleport - Successfully teleported player ${inputs.playerId} to ${inputs.coordX} ${inputs.coordY} ${inputs.coordZ}`);
          return exits.success();
        },
        error: (error) => {
          sails.log.error(`API - Player:teleport - ${error}`);
          return exits.error(error);
        }
      });


    } catch (error) {
      sails.log.error(`API - Player:teleport - ${error}`);
      return exits.error(error);
    }




  }
};
