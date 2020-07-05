module.exports = {


  friendlyName: 'Get player balance',


  description: 'Gets a players current balance (rounded down to nearest int)',


  inputs: {

    playerId: {
      type: 'number',
      description: 'Id of the player',
      required: true
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'number'
    },
  },

  fn: async function (inputs, exits) {

    try {
      let player = await Player.findOne(inputs.playerId);

      let currentCurrency = Math.round(player.currency);
      return exits.success(currentCurrency);
    } catch (error) {
      sails.log.error(`HELPER economy:get-player-balance - ${error}`);
      return exits.error(error);
    }

  }
};

