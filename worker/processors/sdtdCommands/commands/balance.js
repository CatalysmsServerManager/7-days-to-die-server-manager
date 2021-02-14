let SdtdCommand = require('../command.js');
class Balance extends SdtdCommand {
  constructor() {
    super({
      name: 'balance',
      description: 'See your current balance',
      extendedDescription: `Check how much money is in your bankaccount!`,
      aliases: ['bal', 'wallet']
    });
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.economyEnabled;
  }


  async run(chatMessage, player) {

    let playerBalance = await sails.helpers.economy.getPlayerBalance.with({
      playerId: player.id
    });
    return chatMessage.reply('balanceReply', {
      playerBalance: playerBalance
    });
  }
}

module.exports = Balance;
