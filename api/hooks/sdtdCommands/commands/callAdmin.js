let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class callAdmin extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'calladmin',
    });
    this.serverId = serverId;
  }

  async run(chatMessage, player, server, args) {

    try {

      if (!server.config.enabledCallAdmin) {
        return chatMessage.reply('This command is disabled! Ask your server admin to enable this.');
      }

      if (args == '') {
        return chatMessage.reply(`You must tell us what you're having trouble with!`);
      }

      let ticket = await sails.helpers.sdtd.createTicket(
        server.id,
        player.id,
        args.join(' ')
      );

      return chatMessage.reply(`Your ticket has been created, check the website to follow up!`);

    } catch (error) {
      sails.log.error(`HOOK - SdtdCommands:callAdmin - ${error}`);
    }
  }
}

module.exports = callAdmin;
