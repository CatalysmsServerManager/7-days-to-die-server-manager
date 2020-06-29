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
    commandError: {
      description: 'Error executing the command',
      responseType: 'badRequest'
    }
  },

  /**
   * @memberof SdtdServer
   * @name executeCommand
   * @method
   * @description Executes a command on a 7dtd server
   * @param {number} serverId ID of the server
   * @param {string} command Command to be executed
   */

  fn: async function (inputs, exits) {


    try {
      let sdtdServer = await SdtdServer.findOne(inputs.serverId);
      if (_.isUndefined(sdtdServer)) {
        return exits.notFound();
      }
      sevenDays.executeCommand({
        ip: sdtdServer.ip,
        port: sdtdServer.webPort,
        authName: sdtdServer.authName,
        authToken: sdtdServer.authToken,
        command: inputs.command
      }).exec({
        success: (response) => {

          if (!response) {
            return exits.error();
          }

          let logLine = {
            msg: response.result,
            date: new Date(),
            type: 'commandResponse'
          };
          sails.log.info(`API - Executing a command on ${sdtdServer.name} by user ${this.req.session.userId} - ${inputs.command}`);
          return exits.success(logLine);
        },
        unknownCommand: (error) => {
          return exits.commandError(error);
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
