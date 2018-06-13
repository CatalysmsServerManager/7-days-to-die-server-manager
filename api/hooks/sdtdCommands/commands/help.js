let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class help extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'help',
            description: "Get some help"
        });
        this.serverId = serverId;
    }

    async isEnabled(chatMessage, player, server, args) {
        return true
    }

    async run(chatMessage, player, server, args) {

        await chatMessage.reply("Enabled commands:");

        let commandsArr = this.commandHandler.commands.values()

        for (const command of commandsArr) {

            let commandEnabled = await command.isEnabled(chatMessage, player, server, args);

            if (commandEnabled) {
                await chatMessage.reply(`${command.name} - ${command.description}\n`)
            }
        }

        return
    }
}

module.exports = help;
