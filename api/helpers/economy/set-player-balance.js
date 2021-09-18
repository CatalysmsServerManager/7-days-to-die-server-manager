module.exports = {


  friendlyName: 'Set player balance',


  description: 'Sets a players current balance',


  inputs: {

    playerId: {
      type: 'number',
      description: 'Id of the player',
      required: true
    },

    newBalance: {
      type: 'number',
      required: true
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
    },
  },

  fn: async function (inputs, exits) {

    try {
      await Player.update({id: inputs.playerId}, {currency: inputs.newBalance});
      return exits.success();
    } catch (error) {
      sails.log.error(`HELPER economy:set-player-balance - ${error}`, {playerId: inputs.playerId});
      return exits.error(error);
    }

  }
};

