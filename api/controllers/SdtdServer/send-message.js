const sevenDays = require('machinepack-7daystodiewebapi');

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
    success: {},
    notFound: {
      description: 'No server/player with the specified ID was found in the database.',
      responseType: 'notFound'
    },
    notLoggedIn: {
      responseType: 'badRequest',
      description: 'User is not logged in (check signedCookies)'
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

    if (_.isUndefined(this.req.signedCookies.userProfile)) {
      throw 'notLoggedIn';
    }

    sails.log.debug(`API - SdtdServer:send message - sending a message on server ${inputs.serverId} to player: ${inputs.destinationPlayer}`);

    try {
      let sdtdServer = await SdtdServer.findOne(inputs.serverId);
      sevenDays.sendMessage({
        ip: sdtdServer.ip,
        port: sdtdServer.webPort,
        authName: sdtdServer.authName,
        authToken: sdtdServer.authToken,
        message: inputs.message,
        playerID: inputs.destinationPlayer ? inputs.destinationPlayer : undefined
      }).exec({
        success: (response) => {
          return exits.success(response);
        },
        error: (error) => {
          return exits.error(error);
        }
      });

    } catch (error) {
      sails.log.error(`API - SdtdServer:sendMessage - ${error}`);
      return exits.error(error);
    }

  }
};
