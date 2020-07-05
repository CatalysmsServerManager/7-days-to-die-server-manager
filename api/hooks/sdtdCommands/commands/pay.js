const SdtdCommand = require('../command.js');

class Pay extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'pay',
      description: 'Send some currency to another player.',
      extendedDescription: 'Usage: pay <playerName or steamId> amount'
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server, args) {
    return server.config.economyEnabled;
  }


  async run(chatMessage, player, server, args) {

    if (args.length !== 2) {
      return chatMessage.reply('payMissingArguments');
    }

    const playerToSendTo = await Player.find({
      where: {
        or: [{
          steamId: args[0]
        }, {
          name: args[0]
        }],
        server: server.id,
      },
      limit: 1
    });

    const amountToSend = parseInt(args[1]);

    if (isNaN(amountToSend)) {
      return chatMessage.reply(`payInvalidAmount`, {
        amount: args[1]
      });
    }

    if (amountToSend < 1) {
      return chatMessage.reply('payMinimumAmount');
    }

    if (playerToSendTo.length === 0) {
      return chatMessage.reply(`payPlayerNotFound`);
    };

    let playerBalance = await sails.helpers.economy.getPlayerBalance.with({
      playerId: player.id
    });

    if (playerBalance < amountToSend) {
      return chatMessage.reply(`notEnoughMoney`, {
        cost: amountToSend
      });
    }

    await sails.helpers.economy.deductFromPlayer.with({
      playerId: player.id,
      amountToDeduct: amountToSend,
      message: `COMMAND - ${this.name} to ${playerToSendTo[0].name}`,
      useMultiplier: false,
    });

    await sails.helpers.economy.giveToPlayer.with({
      playerId: playerToSendTo[0].id,
      amountToGive: amountToSend,
      message: `COMMAND - ${this.name} from ${player.name}`,
      useMultiplier: false,
    });

    return chatMessage.reply(`paySuccess`, {
      amountToSend: amountToSend,
      recipient: playerToSendTo[0].name
    });
  }
}

module.exports = Pay;
