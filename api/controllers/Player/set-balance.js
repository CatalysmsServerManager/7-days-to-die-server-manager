module.exports = {


  friendlyName: 'Set balance',


  description: '',


  inputs: {

    playerIds: {
      type: ['number'],
      required: true
    },

    mode: {
      type: 'string',
      required: true
    },

    balance: {
      type: 'number',
      required: true,
      min: 0,
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    let playerIds = inputs.playerIds ? inputs.playerIds : [];
    if (inputs.playerId) {
      playerIds.push(inputs.playerId);
    }
    let currencyMap;
    if (inputs.mode === 'give' || inputs.mode === 'deduct') {
      currencyMap = new Map();
      const players = await Player.find({ select: ['id', 'currency'], where: { id: { in: playerIds } } });
      players.forEach((player) => {
        currencyMap.set(player.id, player.currency);
      });
    }
    let promises = [];
    let newBalance;
    playerIds.forEach((playerId) => {
      if (inputs.mode === 'give') {
        newBalance = currencyMap.get(playerId) + inputs.balance;
      } else if (inputs.mode === 'set') {
        newBalance = inputs.balance;
      } else if (inputs.mode === 'deduct') {
        newBalance = currencyMap.get(playerId) - inputs.balance;
      }
      promises.push(
        Player.update({id: playerId}, { currency: newBalance }).fetch().then((updatedPlayer) => {
          HistoricalInfo.create({
            server: updatedPlayer[0].server,
            type: 'economy',
            message: `Set balance to ${newBalance}`,
            player: playerId,
            amount: inputs.balance,
            economyAction: inputs.mode
          });
          sails.log.info(`Set balance of player ${updatedPlayer[0].id} - ${updatedPlayer[0].name} to ${newBalance} on server ${updatedPlayer[0].server}`, {player: updatedPlayer[0], serverId: updatedPlayer[0].server});
        })
      );
    });
    Promise.all(promises);
    return exits.success();

  }
};
