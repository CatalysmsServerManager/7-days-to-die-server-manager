module.exports = {


  friendlyName: 'Set balance',


  description: '',


  inputs: {

    playerId: {
      type: 'string',
      required: true
    },

    newBalance: {
      type: 'number',
      required: true,
      min: 0,
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let updatedPlayer = await Player.update({id: inputs.playerId}, {currency: inputs.newBalance}).fetch();

    await HistoricalInfo.create({
      server: updatedPlayer[0].server,
      type: 'economy',
      message: `Set balance to ${inputs.newBalance}`,
      player: updatedPlayer[0].id,
      amount: inputs.newBalance,
      economyAction: 'set'
    });

    sails.log.info(`Set balance of player ${updatedPlayer[0].id} - ${updatedPlayer[0].name} to ${inputs.newBalance} on server ${updatedPlayer[0].server}`);
    return exits.success();

  }


};
