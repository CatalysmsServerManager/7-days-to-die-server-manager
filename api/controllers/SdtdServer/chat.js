module.exports = {

  friendlyName: 'Chat',

  description: 'Start the chat bridge of a 7 Days to Die server & serve view',

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
      viewTemplatePath: 'sdtdServer/chat'
    },
    notFound: {
      description: 'No server with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },

  /**
   * @memberof SdtdServer
   * @name chat
   *    * @method
   * @description Serves the chatbridge view
   * @param {number} serverID ID of the server
   */

  fn: async function (inputs, exits) {

    sails.log.debug(`VIEW - SdtdServer:chat - Showing chat for ${inputs.serverId}`, {serverId: inputs.serverId});

    try {
      let server = await SdtdServer.findOne(inputs.serverId);
      return exits.success({
        server: server
      });
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:chat - ${error}`, {serverId: inputs.serverId});
      throw 'notFound';
    }


  }
};
