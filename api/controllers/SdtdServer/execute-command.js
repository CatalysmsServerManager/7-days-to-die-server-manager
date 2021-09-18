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
      let server = await SdtdServer.findOne(inputs.serverId);
      if (_.isUndefined(server)) {
        return exits.notFound();
      }

      const response = await sails.helpers.sdtdApi.executeConsoleCommand(SdtdServer.getAPIConfig(server), inputs.command);

      if (!response) {
        return exits.error();
      }

      let logLine = {
        msg: response.result,
        date: new Date(),
        type: 'commandResponse'
      };
      sails.log.info(`API - Executed a command on ${server.name} by user ${this.req.session.userId} - ${inputs.command}`, {server});
      return exits.success(logLine);

    } catch (error) {
      if (error.message === 'Not Found') {
        return exits.success({
          msg: 'Error: unknown command',
          date: new Date(),
          type: 'commandResponse'
        });
      }

      sails.log.error(`API - SdtdServer:executeCommand - ${error}`, {serverId: inputs.serverId});
      return exits.commandError(error);
    }

  }
};
