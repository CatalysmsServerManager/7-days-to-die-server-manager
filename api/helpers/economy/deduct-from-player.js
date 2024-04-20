module.exports = {


  friendlyName: 'Deduct from player',


  description: 'Take a certain amount of currency to a player',


  inputs: {

    playerId: {
      type: 'number',
      description: 'Id of the server',
      required: true
    },

    amountToDeduct: {
      type: 'number',
      required: true
    },

    message: {
      type: 'string',
      maxLength: 500
    },

    useMultiplier: {
      type: 'boolean',
      defaultsTo: true
    },

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
    },
    notEnoughCurrency: {
      description: 'Player did not have enough currency in balance to deduct this amount'
    }
  },

  fn: async function (inputs, exits) {
    let playerToDeductFrom = await Player.findOne(inputs.playerId);
    let currentBalance = playerToDeductFrom.currency;

    if (inputs.useMultiplier) {
      let playerRole = await sails.helpers.sdtd.getPlayerRole(inputs.playerId);
      inputs.amountToDeduct = inputs.amountToDeduct * playerRole.economyDeductMultiplier;
    }

    let newBalance = currentBalance - inputs.amountToDeduct;
    if (newBalance < 0) {
      return exits.notEnoughCurrency(Math.abs(newBalance));
    }

    // Transactions in sails are weird.
    // See: https://dev.paygoenergy.co/blog/2019-06-20-sailsjs-transactions-and-exits/
    await sails
      .getDatastore()
      .sendNativeQuery('UPDATE player SET currency=currency-$1 WHERE id=$2', [inputs.amountToDeduct, playerToDeductFrom.id]);


    await HistoricalInfo.create({
      server: playerToDeductFrom.server,
      type: 'economy',
      message: inputs.message ? inputs.message : `Deducted currency from player`,
      player: inputs.playerId,
      amount: inputs.amountToDeduct,
      economyAction: 'deduct'
    });

    return exits.success();
  }
};
