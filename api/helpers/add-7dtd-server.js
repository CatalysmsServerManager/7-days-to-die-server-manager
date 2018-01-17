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
      type: 'string',
      required: true
    },
    discordGuildId: {
      type: 'string',
      required: false
    }

  },

  exits: {
    badTelnet: {
      description: "Could not connect to telnet"
    },
    badWebPort: {
      description: "WebPort given was not valid"
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
   * @param {number} discordGuildId
   * @memberof module:Helpers
   * @method
   */

  fn: function (inputs, exits) {

    sails.log.debug(`HELPER - add7DtdServer - adding a server with ip: ${inputs.ip} webPort: ${inputs.webPort} owner: ${inputs.owner}`);

    sails.helpers.createWebToken.with({
      ip: inputs.ip,
      port: inputs.telnetPort,
      password: inputs.telnetPassword
    }).switch({
      error: function (err) {
        sails.log.error(`HELPER - add7DtdServer - ${err}`);
        return exits.error(new Error('Could not create webtokens via telnet!' + err));
      },
      badTelnet: function (err) {
        return exits.badTelnet(err)
      },
      success: async function (authInfo) {
        try {
          let server = await updateOrCreateServer(authInfo);
          return exits.success(server)
        } catch (error) {
          return exits.error(error)
        }



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
          authName: authInfo.authName,
          authToken: authInfo.authToken,
          owner: inputs.owner,
          discordGuildId: inputs.discordGuildId ? inputs.discordGuildId : 0
        });

        let status = await sails.helpers.sdtd.checkIfAvailable(newServer.id)
          .tolerate('notAvailable', function () {
            sails.log.debug(`HELPER - add7DtdServer - not available`);
            return exits.badWebPort()
          })
        sails.log.debug(`HELPER - add7DtdServer - success`);
        sails.hooks.sdtdlogs.start(newServer.id);
        return newServer;
      } catch (error) {
        sails.log.error(`HELPER - add7DtdServer - ${error}`);
        exits.error(new Error('Error while creating/updating server in DB' + error));
      }
    }
  }

};
