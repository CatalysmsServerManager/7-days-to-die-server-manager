module.exports = {


  friendlyName: 'Add Currency',


  description: 'Adds some currency to a players balance',

  inputs: {
    playerId: {
      type: 'number',
      required: true,
    },

    currencyToAdd: {
      type: 'number',
      required: true,
    },

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'boolean'
    },


  },



  fn: async function (inputs, exits) {

    let player = await Player.findOne(inputs.playerId);

    if (_.isUndefined(player)) {
      return exits.error(`Unknown player`);
    }

    if (inputs.currencyToAdd > 0) {
      await sails.helpers.economy.giveToPlayer(player.id, inputs.currencyToAdd, 'Function call from a custom command');
    }

    if (inputs.currencyToAdd < 0) {
      await sails.helpers.economy.deductFromPlayer(player.id, inputs.currencyToAdd * -1, 'Function call from a custom command');
    }

    return exits.success();

  }


};
