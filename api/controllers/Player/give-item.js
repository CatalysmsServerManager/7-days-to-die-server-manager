var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {

  friendlyName: 'Give item',

  description: 'Give item(s) to a player from the server',

  inputs: {
    playerId: {
      description: 'The ID of the player',
      type: 'number',
      required: true
    },

    itemName: {
      type: 'string',
      required: true
    },

    amount: {
      type: 'number',
      required: true
    },

    quality: {
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
   * @description Give items to a player
   * @param {string} playerId  Id of the player
   */

  fn: async function (inputs, exits) {

    try {

      sails.log.debug(`API - Player:give-item - giving ${inputs.amount} of ${inputs.itemName} to ${inputs.playerId} with quality: ${inputs.quality}`);
      let player = await Player.findOne(inputs.playerId).populate('server');
      let server = await SdtdServer.findOne(player.server.id);

      return sevenDays.giveItem({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        entityId: player.entityId,
        itemName: inputs.itemName,
        amount: inputs.amount,
        quality: inputs.quality
      }).exec({
        error: function (error) {
          return exits.error(error);
        },
        playerNotFound: function () {
          return exits.notFound('Did not find online player with given ID');
        },
        itemNotFound: function () {
          return exits.notFound('Did not find given item');
        },
        success: function (response) {
          return exits.success(response);
        }
      });

    } catch (error) {
      sails.log.error(`API - Player:give-item - ${error}`);
      return exits.error(error);
    }




  }
};
