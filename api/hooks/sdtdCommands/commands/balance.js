let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class Balance extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'balance',
      description: "See your current balance",
      extendedDescription: "How much money is in your bankaccount!"
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server, args) {
    return server.config.economyEnabled
  }


  async run(chatMessage, player, server, args) {

    let playerBalance = await sails.helpers.economy.getPlayerBalance.with({
      playerId: player.id
    })
    return chatMessage.reply(`Your balance is currently ${playerBalance} ${server.config.currencyName}`);
  }
}

module.exports = Balance;
