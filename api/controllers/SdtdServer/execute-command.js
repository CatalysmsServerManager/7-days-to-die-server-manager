const sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {

  friendlyName: 'Execute command',

  description: 'Execute a command on a 7 Days to Die server',

  inputs: {
    serverId: {
      description: 'The ID of the server to look up.',
      type: 'number',
      required: true
    },
    command: {
      description: 'Command to execute',
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {},
    notFound: {
      description: 'No server with the specified ID was found in the database.',
      responseType: 'notFound'
    },
    notLoggedIn: {
      responseType: 'badRequest',
      description: 'User is not logged in (check signedCookies)'
    }
  },

  /**
   * @memberof SdtdServer
   * @name executeCommand
   * @method
   * @description Executes a command on a 7dtd server
   * @param {number} serverID ID of the server
   * @param {string} command Command to be executed
   */

  fn: async function (inputs, exits) {
    sails.log.debug(`API - SdtdServer:executeCommand - Executing a command on server ${inputs.serverId}`);

    if (_.isUndefined(this.req.signedCookies.userProfile)) {
      throw 'notLoggedIn';
    }

    try {
      let sdtdServer = await SdtdServer.findOne(inputs.serverId);
      sevenDays.executeCommand({
        ip: sdtdServer.ip,
        port: sdtdServer.webPort,
        authName: sdtdServer.authName,
        authToken: sdtdServer.authToken,
        command: inputs.command
      }).exec({
        success: (response) => {
          let logLine = {
            msg: response.result,
            date: new Date(),
            type: 'commandResponse'
          };
          return exits.success(logLine);
        },
        error: (error) => {
          return exits.error(error);
        }
      });

    } catch (error) {
      sails.log.error(`API - SdtdServer:executeCommand - ${error}`);
      return exits.error(error);
    }

  }
};
