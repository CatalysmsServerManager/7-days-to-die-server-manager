module.exports = {


  friendlyName: 'Get server info',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      outputFriendlyName: 'Server info',
      outputExample: '==='
    }

  },


  fn: async function (inputs, exits) {

    // Get server info.
    var serverInfo;
    // TODO

    // Send back the result through the success exit.
    return exits.success(serverInfo);

  }


};

