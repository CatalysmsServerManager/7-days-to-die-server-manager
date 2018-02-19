const Telnet = require('telnet-client');
const randToken = require('rand-token');

/**
 * @module Helpers
 * @description Helper functions
 */

module.exports = {


  friendlyName: 'Create web token',


  description: 'Connects to telnet, adds webtokens to the server and returns these',


  inputs: {

    ip: {
      type: 'string',
      description: 'IP address of server to connect to',
      required: true
    },

    port: {
      type: 'number',
      description: 'Telnet port',
      required: true
    },

    password: {
      type: 'string',
      description: 'Telnet password',
      required: true
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Connected and tokens added'
    },
    badTelnet: {
      description: 'Could not connect to telnet'
    }
  },

  /**
     * @description Executes webtokens add command on a server
     * @name createWebTokens
     * @memberof module:Helpers
     * @returns {json} Authname and token
     * @method
     * @param {string} ip
     * @param {number} port Telnet port
     * @param {string} password Telnet password
     */

  fn: async function(inputs, exits) {
    sails.log.debug(`HELPER - createWebTokens - creating tokens for server with ip ${inputs.ip}`);
    const authName = 'CSMM';
    const authToken = randToken.generate(32);

    let connection = new Telnet();
    let params = {
      host: inputs.ip,
      port: inputs.port,
      timeout: 3000,
      password: inputs.password,
      failedLoginMatch: 'Password incorrect',
      passwordPrompt: /Please enter password:/i,
      shellPrompt: /\r\n$/,
    };
    connection.connect(params);

    connection.on('ready', function(prompt) {
      connection.exec(`webtokens add ${authName} ${authToken} 0`, async function(err, response) {
        if (err) { return exits.error(err); }
        if (_.isUndefined(response) || response.length <= 0) {
          await connection.end();
          return exits.badTelnet(new Error('Did not receive a response from the server'));
        } else {
          sails.log.debug('HELPER - createWebTokens - successfully created tokens');
          await connection.end();
          return exits.success({ authName: authName, authToken: authToken });
        }

      });
    });

    connection.on('error', function(error) {
      sails.log.error(`HELPER - createWebTokens - ${error}`);
      return exits.badTelnet(error);
    });


  }


};
