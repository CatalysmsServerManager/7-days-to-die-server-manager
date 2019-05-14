let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class Pay extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'pay',
      description: "Send some currency to another player.",
      extendedDescription: "Usage: pay <playerName or steamId> amount"
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server, args) {
    return server.config.economyEnabled;
  }


  async run(chatMessage, player, server, args) {

    if (args.length !== 2) {
      return chatMessage.reply('Please provide a name or steam ID of the player you want to send money to and the amount.');
    }

    const playerToSendTo = await Player.find({
      where: {
        or: [{
          steamId: args[0]
        }, {
          name: args[0]
        }],
      },
      limit: 1
    });

    const amountToSend = parseInt(args[1]);

    if (isNaN(amountToSend)) {
      return chatMessage.reply(`Amount to send must be a valid integer. You provided ${args[1]}`);
    }

    if (amountToSend < 1) {
      return chatMessage.reply(`You must send at least 1 ${server.config.currencyName} to the other player`);
    }

    if (playerToSendTo.length === 0) {
      return chatMessage.reply(`Did not find the player you want to send to. Try using the steam ID if you are unsure of the spelling of the name`);
    };

    let playerBalance = await sails.helpers.economy.getPlayerBalance.with({
      playerId: player.id
    });

    if (playerBalance < amountToSend) {
      return chatMessage.reply(`You do not have enough ${server.config.currencyName}! Your curreny balance is ${playerBalance} ${server.config.currencyName}.`);
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

    return chatMessage.reply(`Successfully sent ${amountToSend} ${server.config.currencyName} to ${playerToSendTo[0].name}`);
  }
}

module.exports = Pay;
