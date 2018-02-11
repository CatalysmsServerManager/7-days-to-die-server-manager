const sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {

  friendlyName: 'Add 7 Days to Die server',


  description: 'Add a 7 Days to Die server to the system (while verifying the input).',


  inputs: {

    serverName: {
      type: 'string',
      required: true
    },
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
      description: 'Could not connect to telnet'
    },
    badWebPort: {
      description: 'WebPort given was not valid'
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

  fn: async function (inputs, exits) {

    sails.log.debug(`HELPER - add7DtdServer - adding a server with ip: ${inputs.ip} webPort: ${inputs.webPort} owner: ${inputs.owner}`);

    try {
      let authInfo = await sails.helpers.createWebToken.with({
        ip: inputs.ip,
        port: inputs.telnetPort,
        password: inputs.telnetPassword
      }).tolerate('badTelnet',() => {
        return undefined
      })

      if (_.isUndefined(authInfo)) {
        return exits.badTelnet({error: 'badTelnet'});
      }

      await sevenDays.getStats({
        ip: inputs.ip,
        port: inputs.webPort,
        authName: authInfo.authName,
        authToken: authInfo.authToken
      }).exec({
        success: async response => {
          if (!response.gametime) {
            return exits.badWebPort({error: 'badWebPort'});
          } else {
            let server = await updateOrCreateServer(authInfo);
            await SdtdConfig.create({
              server: server.id
            });
            return exits.success(server);
          }
        },
        error: err => {
          return exits.error(err)
        }
      })



    } catch (error) {
      sails.log.error(`HELPER - add7DtdServer - ${error}`);
      if (error.message == 'badWebport') {
        return exits.badWebPort({error: 'badWebPort'});
      }
      return exits.error(error);
    }


    async function updateOrCreateServer(authInfo) {
      return new Promise(async (resolve, reject) => {
        let newServer = await SdtdServer.findOrCreate({
          ip: inputs.ip,
          webPort: inputs.webPort,
          authName: authInfo.authName,
          authToken: authInfo.authToken
        }, {
            name: inputs.serverName,
            ip: inputs.ip,
            webPort: inputs.webPort,
            telnetPort: inputs.telnetPort,
            authName: authInfo.authName,
            authToken: authInfo.authToken,
            owner: inputs.owner
          });
        sails.log.debug(`HELPER - add7DtdServer - success`);
        sails.hooks.sdtdlogs.start(newServer.id);
        resolve(newServer);
      });


    }
  }

};
