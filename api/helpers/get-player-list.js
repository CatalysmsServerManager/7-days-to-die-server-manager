module.exports = {


  friendlyName: 'Get player list',

  description: '',


  inputs: {

  },


  exits: {

    success: {
      outputFriendlyName: 'Player list',
      outputExample: '==='
    }

  },


  fn: async function (inputs, exits) {

    // Get player list.
    var playerList;
    // TODO

    // Send back the result through the success exit.
    return exits.success(playerList);

  }


};

