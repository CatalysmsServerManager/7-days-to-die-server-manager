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
    },
    notLoggedIn: {
      responseType: 'badRequest',
      description: 'User is not logged in (check signedCookies)'
    }
  },

  /**
   * @memberof SdtdServer
   * @name chat
   * @description Serves the chatbridge view
   * @param {number} serverID ID of the server 
   */

  fn: async function (inputs, exits) {

    if (_.isUndefined(this.req.signedCookies.userProfile)) {
      throw 'notLoggedIn'
    }

    sails.log.debug(`VIEW - SdtdServer:chat - Showing chat for ${inputs.serverId}`)

    try {
      let server = await SdtdServer.findOne(inputs.serverId);
      return exits.success({
        server: server
      })
    } catch (error) {
      sails.log.error(`VIEW - SdtdServer:chat - ${error}`)
      throw 'notFound';
    }


  }
};
