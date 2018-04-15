let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class Balance extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'balance',
        });
        this.serverId = serverId;
    }

    async run(chatMessage, player, server, args) {


        if (!server.config.economyEnabled) {
            return chatMessage.reply(`This command is disabled! Ask your server admin to enable this.`)
        }

        let playerBalance = await sails.helpers.economy.getPlayerBalance.with({playerId: player.id})
        return chatMessage.reply(`Your balance is currently ${playerBalance} ${server.config.currencyName}`);
    }
}

module.exports = Balance;
