const SdtdCommand = require('../command.js');

class help extends SdtdCommand {
  constructor() {
    super({
      name: 'help',
      description: 'Get some help'
    });
  }

  async isEnabled() {
    return true;
  }

  async run(chatMessage, player, server, args) {

    if (player.role) {
      player.role = await Role.findOne({
        id: player.role
      });
    } else {
      player.role = await sails.helpers.roles.getDefaultRole(server.id);
    }

    if (args[0]) {
      let commandToGetHelp = await this.commandHandler.findCommandToExecute(args[0]);

      if (commandToGetHelp) {

        let commandEnabled = await commandToGetHelp.isEnabled(chatMessage, player, server, args);

        if (!commandEnabled) {
          return await chatMessage.reply(`This command is not currently enabled! Ask a server admin to enable it.`);
        }

        await chatMessage.reply(`${commandToGetHelp.name} - ${commandToGetHelp.description}`);
        await chatMessage.reply(`${commandToGetHelp.extendedDescription}`);
        await chatMessage.reply(`Aliases: ${commandToGetHelp.aliases}`);
      } else {
        await chatMessage.reply(`Unknown command! Use help without argument to see a full list`);
      }
      return;
    }

    const commandsArr = this.commandHandler.commands.values();
    const customCommands = await CustomCommand.find({
      where: {
        server: server.id,
        level: {
          '>=': player.role.level
        },
        enabled: true,
      }
    });
    await chatMessage.reply('Enabled commands:');

    for (const command of commandsArr) {

      let commandEnabled = await command.isEnabled(chatMessage, player, server, args);

      if (commandEnabled) {
        await chatMessage.reply(`${command.name} - ${command.description}`);
      }
    }

    for (const command of customCommands) {

      await chatMessage.reply(`${command.name} - ${command.description}`);
    }

    await chatMessage.reply(`For more info see: https://docs.csmm.app`);

    return;
  }
}

module.exports = help;
