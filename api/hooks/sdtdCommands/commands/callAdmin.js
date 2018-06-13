let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class callAdmin extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'calladmin',
      description: "Make a support ticket",
      extendedDescription: "Creates a support ticket on the website and notifies admins of your call for help"
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server, args) {
    return server.config.enabledCallAdmin
  }

  async run(chatMessage, player, server, args) {

    try {

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
