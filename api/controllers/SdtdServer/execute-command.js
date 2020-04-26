const sevenDays = require('7daystodie-api-wrapper');

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
    },
    unknownPlayer: {
      variableName: 'error',
      description: "The given player id is not valid"
    },
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
    const sdtdServer = await SdtdServer.findOne(inputs.serverId);
    if (_.isUndefined(sdtdServer)) {
      return exits.notFound();
    }
    try {
      const response = await sevenDays.executeConsoleCommand(SdtdServer.getAPIConfig(sdtdServer), inputs.command);
      if (response.result.includes('Playername or entity/steamid id not found.')) {
        return exits.unknownPlayer("Playername or entity/steamid id not found.")
      }
      const logLine = {
        msg: response.result,
        date: new Date(),
        type: 'commandResponse'
      };
      sails.log.info(`API - Executing a command on ${sdtdServer.name} by user ${this.req.session.userId} - ${inputs.command}`);
      return exits.success(logLine);
    } catch (error) {
      console.log('error', error);
      if (error.message === 'Not Found') {
        const logLine = {
          msg: 'Command not found',
          date: new Date(),
          type: 'commandResponse'
        };
        sails.log.info(`API - Executing a command on ${sdtdServer.name} by user ${this.req.session.userId} - ${inputs.command}`);
        return exits.success(logLine);
      } else {
        sails.log.error(`API - SdtdServer:executeCommand`, error);
        return exits.error(error);
      }
    }

  }
};
