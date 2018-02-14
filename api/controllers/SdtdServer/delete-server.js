const sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {

  friendlyName: 'Delete server',

  description: 'Delete a server from the system',

  inputs: {
    serverId: {
      description: 'The ID of the server',
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'sdtdServer/delete'
    },
    notFound: {
      description: 'No server with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },

  /**
   * @memberof SdtdServer
   * @name delete
   * @method
   * @description Deletes a server from the system
   * @param {number} serverID ID of the server
   */

  fn: async function (inputs, exits) {

    sails.log.debug(`VIEW - SdtdServer:delete - Deleting server ${inputs.serverId}`);

    try {
      let server = await SdtdServer.findOne(inputs.serverId);
      if (_.isUndefined(server)) {
        return exits.notFound();
      }

      await sails.hooks.sdtdlogs.stop(server.id);

      sevenDays.executeCommand({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        command: `webtokens remove ${server.authName}`
      }).exec({
        success: result => {
        },
        error: error => {
          sails.log.warn(`VIEW - SdtdServer:delete- Error while trying to delete token - ${error}`);
        }
      })

      await SdtdConfig.destroy({
        server: server.id
      });
      await Player.destroy({
        server: server.id
      })
      await SdtdServer.destroy({
        id: server.id
      });

      exits.success();

    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:delete - ${error}`);
      exits.error(error);
    }


  }
};
