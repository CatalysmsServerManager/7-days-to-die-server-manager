const sevenDays = require('7daystodie-api-wrapper');

module.exports = {

  friendlyName: 'Send message',

  description: 'Execute a message on a 7 Days to Die server',

  inputs: {
    serverId: {
      description: 'The ID of the server to look up.',
      type: 'number',
      required: true
    },
    message: {
      description: 'message to send',
      type: 'string',
      required: true
    },
    destinationPlayer: {
      description: 'Player to send a message to (steamID)',
      type:'string'
    }
  },

  exits: {
    success: {
    },
    notFound: {
      description: 'No server/player with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },

  /**
   * @memberof SdtdServer
   * @name sendMessage
   * @method
   * @description sends a message on a 7dtd server
   * @param {number} serverID ID of the server
   * @param {string} message Message to be executed
   * @param {string} destinationPlayer SteamID of the player to send a message to
   */

  fn: async function (inputs, exits) {
    sails.log.debug(`API - SdtdServer:send message - sending a message on server ${inputs.serverId} to player: ${inputs.destinationPlayer}`);
    try {
      let server = await SdtdServer.findOne(inputs.serverId);
      await sails.helpers.commands.sendMessage.with({
        serverId: server.id,
        message: "foo",
        destinationPlayer: 1234
      });
      return exits.success();
    } catch (error) {
      sails.log.error(`API - SdtdServer:sendMessage`, error);
      return exits.error(error);
    }

  }
};
