module.exports = {


  friendlyName: 'Give to player',


  description: 'Give a certain amount of currency to a player',


  inputs: {

    playerId: {
      type: 'number',
      description: 'Id of the server',
      required: true
    },

    amountToGive: {
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
    }
  },

  fn: async function (inputs, exits) {
    let playerToGiveTo = await Player.findOne(inputs.playerId);
    if (inputs.useMultiplier) {
      let playerRole = await sails.helpers.sdtd.getPlayerRole(inputs.playerId);
      inputs.amountToGive = (inputs.amountToGive * playerRole.economyGiveMultiplier);
    }

    // Transactions in sails are weird.
    // See: https://dev.paygoenergy.co/blog/2019-06-20-sailsjs-transactions-and-exits/
    await sails
      .getDatastore()
      .sendNativeQuery('UPDATE player SET currency=currency+$1 WHERE id=$2', [inputs.amountToGive, playerToGiveTo.id]);


    await HistoricalInfo.create({
      server: playerToGiveTo.server,
      type: 'economy',
      message: inputs.message ? inputs.message : `Gave currency to player`,
      player: inputs.playerId,
      amount: inputs.amountToGive,
      economyAction: 'give'
    });

    return exits.success();
  }
};
