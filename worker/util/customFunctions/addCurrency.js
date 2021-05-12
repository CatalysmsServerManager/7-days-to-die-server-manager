const CustomFunction = require('./base');

class AddCurrency extends CustomFunction {
  constructor(server) { super(server); }
  async exec(args) {
    const playerId = args[0];
    const currencyToAdd = args[1];

    let player = await Player.find({
      or: [
        { id: playerId },
        { steamId: playerId, server: this.server.id },
        { name: playerId, server: this.server.id }
      ]
    });

    player = player[0];

    if (!player) { throw new Error(`Unknown player`); }


    if (currencyToAdd > 0) {
      await sails.helpers.economy.giveToPlayer(
        player.id,
        currencyToAdd,
        'Function call from a custom command - add'
      );
    }

    if (currencyToAdd < 0) {
      await sails.helpers.economy.deductFromPlayer(
        player.id,
        Math.abs(currencyToAdd),
        'Function call from a custom command - deduct'
      );
    }
  }
}

module.exports = AddCurrency;
