module.exports = {

  friendlyName: 'Add 7 Days to Die server',


  description: 'Add a 7 Days to Die server to the system (while verifying the input).',


  inputs: {

    ip: {
      type: 'string',
      required: true
    },
    telnetPort: {
      type: 'number',
      required: true
    },
    telnetPassword: {
      type: 'string',
      required: true
    },
    webPort: {
      type: 'number',
      required: true
    },
    owner: {
      type: 'number',
      required: true
    }

  },

  /**
   * @description Adds a 7 Days to die server to the system while verifying input
   * @name Add7dtdServer
   * @param {string} ip
   * @param {number} telnetPort
   * @param {string} telnetPassword
   * @param {number} webPort
   * @param {number} owner The ID of the owner
   * @memberof module:Helpers
   * @method
   */

  fn: function (inputs, exits) {

    sails.helpers.createWebToken.with({
      ip: inputs.ip,
      port: inputs.telnetPort,
      password: inputs.telnetPassword
    }).switch({
      error: function (err) {
        return exits.error(new Error('Could not create webtokens via telnet!' + err))
      },
      success: async function (authInfo) {
        let server = await updateOrCreateServer(authInfo)
        return exits.success(server)
      }
    });


    async function updateOrCreateServer(authInfo) {
      try {
        let newServer = await SdtdServer.findOrCreate({
          ip: inputs.ip,
          webPort: inputs.webPort,
          authName: authInfo.authName,
          authToken: authInfo.authToken
        }, {
          ip: inputs.ip,
          webPort: inputs.webPort,
          telnetPort: inputs.telnetPort,
          telnetPassword: inputs.telnetPassword,
          authName: authInfo.authName,
          authToken: authInfo.authToken,
          owner: inputs.owner
        })
        return newServer
      } catch (error) {
        exits.error(new Error('Error while creating/updating server in DB' + error))
      }
    }
  }

};
