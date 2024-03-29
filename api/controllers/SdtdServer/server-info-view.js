module.exports = {

  friendlyName: 'Server info view',

  description: 'Serve view witj full serverinfo',

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
      viewTemplatePath: 'sdtdServer/info'
    },
    notFound: {
      description: 'No server with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },

  /**
     * @memberof SdtdServer
     * @name server-infoview
     * @method
     * @description Serves the serverinfo view
     * @param {number} serverId ID of the server
     */

  fn: async function (inputs, exits) {

    sails.log.debug(`VIEW - SdtdServer:info - Showing info for ${inputs.serverId}`, {serverId: inputs.serverId});

    try {
      let server = await sails.helpers.loadSdtdserverInfo(inputs.serverId);
      return exits.success({
        server: server
      });
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:info - ${error}`, {serverId: inputs.serverId});
      throw 'notFound';
    }


  }
};
