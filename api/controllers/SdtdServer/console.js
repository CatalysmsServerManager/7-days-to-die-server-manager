module.exports = {

  friendlyName: 'Console',

  description: 'Start the console of a 7 Days to Die server',

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
      viewTemplatePath: 'sdtdServer/console'
    },
    notFound: {
      description: 'No server with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },

  /**
   * @memberof SdtdServer
   * @name console
   * @method
   * @description Server the console view
   * @param {number} serverID ID of the server
   */

  fn: async function (inputs, exits) {

    sails.log.debug(`VIEW - SdtdServer:console - Showing console for ${inputs.serverId}`, {serverId: inputs.serverId});

    try {
      let server = await SdtdServer.findOne(inputs.serverId);
      return exits.success({
        server: server
      });
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:console - ${error}`, {serverId: inputs.serverId});
      throw 'notFound';
    }


  }
};
