const sevenDays = require('7daystodie-api-wrapper');

module.exports = {

  friendlyName: 'Send message',

  description: 'Execute a message on a 7 Days to Die server',

  inputs: {
    server: {
      description: 'server to send to.',
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
    let server = await SdtdServer.findOne({ id: inputs.serverId });

    sails.log.debug(`API - SdtdServer:send message - sending a message on server ${inputs.serverId} to player: ${inputs.destinationPlayer}`);
    try {
      if (inputs.destinationPlayer) {
        await sevenDays.executeConsoleCommand(SdtdServer.getAPIConfig(server), `pm ${inputs.destinationPlayer} ${inputs.message}`);
      } else {
        await sevenDays.executeConsoleCommand(SdtdServer.getAPIConfig(server), `say ${inputs.message}`);
      }
      return exits.success(response);
    } catch (error) {
      sails.log.error(`API - SdtdServer:sendMessage`, error);
      return exits.error(error);
    }

  }
};
