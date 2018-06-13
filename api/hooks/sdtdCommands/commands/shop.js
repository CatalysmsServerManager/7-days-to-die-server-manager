let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class Shop extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'shop',
            description: "Get a link to the shop",
            extendedDescription: ""
        });
        this.serverId = serverId;
    }

    async isEnabled(chatMessage, player, server, args) {
        return server.config.economyEnabled
    }

    async run(chatMessage, player, server, args) {

        if (!server.config.economyEnabled) {
            return chatMessage.reply(`This command is disabled! Ask your server admin to enable this.`)
        }

        return chatMessage.reply(`${process.env.CSMM_HOSTNAME}/shop/${server.id}`);
    }
}

module.exports = Shop;
