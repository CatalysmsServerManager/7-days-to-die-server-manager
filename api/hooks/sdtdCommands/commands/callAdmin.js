let SdtdCommand = require('../command.js');

class callAdmin extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'calladmin',
      description: 'Make a support ticket',
      extendedDescription: 'Creates a support ticket on the website and notifies admins of your call for help',
      aliases: ['admin', 'admins', 'support']
    });
    this.serverId = serverId;
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.enabledCallAdmin;
  }

  async run(chatMessage, player, server, args) {

    try {

      if (args === '') {
        return chatMessage.reply('callAdminMissingReason');
      }

      if (args.join(' ').length > 100) {
        return chatMessage.reply('callAdminTooLong');
      }

      let ticket = await sails.helpers.sdtd.createTicket(
        server.id,
        player.id,
        args.join(' ')
      );

      return chatMessage.reply('callAdminSuccess', {
        ticket: ticket
      });

    } catch (error) {
      sails.log.error(`HOOK - SdtdCommands:callAdmin - ${error}`);
      return chatMessage.reply('error');
    }
  }
}

module.exports = callAdmin;
