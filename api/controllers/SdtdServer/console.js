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
      },
      notLoggedIn: {
        responseType: 'badRequest',
        description: 'User is not logged in (check signedCookies)'
      }
    },
  
    fn: async function (inputs, exits) {
  
      if (_.isUndefined(this.req.signedCookies.userProfile)) {
        throw 'notLoggedIn'
      }
  
      sails.log.debug(`VIEW - SdtdServer:console - Showing console for ${inputs.serverId}`)
  
      try {
        let server = await SdtdServer.findOne(inputs.serverId);
        return exits.success({server: server})
      } catch (error) {
        sails.log.error(`VIEW - SdtdServer:console - ${error}`)
        throw 'notFound';
      }
  
  
    }
  };
  