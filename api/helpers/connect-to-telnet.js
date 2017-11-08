module.exports = {


  friendlyName: 'Connect to telnet',


  description: 'Connect to a servers telnet. Return a telnet connection if succesful',


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
      outputFriendlyName: 'Connected'
    }


  },


  fn: async function(inputs, exits) {


    const Telnet = require('telnet-client');
    let connection = new Telnet();
    let params = {
      host: inputs.ip,
      port: inputs.port,
      password: inputs.password,
      failedLoginMatch: 'Password incorrect',
      passwordPrompt: /Please enter password:/i,
      shellPrompt: /\r\n$/,
    };

    try {
      await connection.connect(params);
      // All done.
      return exits.success(connection);
    } catch (error) {
      return exits.error(error);
    }




  }


};
