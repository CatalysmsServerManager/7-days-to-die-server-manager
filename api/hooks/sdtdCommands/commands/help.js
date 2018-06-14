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

        if (args[0]) {
            let commandToGetHelp = await this.commandHandler.findCommandToExecute(args[0]);

            if (commandToGetHelp) {

                let commandEnabled = await commandToGetHelp.isEnabled(chatMessage, player, server, args);

                if (!commandEnabled) {
                    return await chatMessage.reply(`This command is not currently enabled! Ask a server admin to enable it.`)
                }                

                await chatMessage.reply(`${commandToGetHelp.name} - ${commandToGetHelp.description}`);
                await chatMessage.reply(`${commandToGetHelp.extendedDescription}`);
                await chatMessage.reply(`Aliases: ${commandToGetHelp.aliases}`)
            } else {
                await chatMessage.reply(`Unknown command! Use help without argument to see a full list`)
            }
            return
        }


        await chatMessage.reply("Enabled commands:");

        let commandsArr = this.commandHandler.commands.values()

        for (const command of commandsArr) {

            let commandEnabled = await command.isEnabled(chatMessage, player, server, args);

            if (commandEnabled) {
                await chatMessage.reply(`${command.name} - ${command.description}`)
            }
        }

        await chatMessage.reply(`For more info see: http://csmm.readthedocs.io/en/latest/pages/for-players.html`)

        return
    }
}

module.exports = help;
