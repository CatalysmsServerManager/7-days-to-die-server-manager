const CustomFunction = require('./base');

class AddCurrency extends CustomFunction {

  async exec() {
    let player = await Player.find({
      or: [
        { id: idAsInt },
        { steamId: inputs.playerId, server: inputs.serverId },
        { name: inputs.playerId, server: inputs.serverId }
      ]
    });

    player = player[0];

    if (_.isUndefined(player)) {
      return exits.error(new Error(`Unknown player`));
    }

    if (inputs.currencyToAdd > 0) {
      await sails.helpers.economy.giveToPlayer(
        player.id,
        inputs.currencyToAdd,
        'Function call from a custom command - add'
      );
    }

    if (inputs.currencyToAdd < 0) {
      await sails.helpers.economy.deductFromPlayer(
        player.id,
        Math.abs(inputs.currencyToAdd),
        'Function call from a custom command - deduct'
      );
    }
  }
}

module.exports = AddCurrency;
