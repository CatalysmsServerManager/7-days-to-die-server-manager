const SdtdCommand = require('../command.js');

class callAdmin extends SdtdCommand {
  constructor() {
    super({
      name: 'calladmin',
      description: 'Make a support ticket',
      extendedDescription: 'Creates a support ticket on the website and notifies admins of your call for help. Usage: "$calladmin help my bike is stuck"',
      aliases: ['admin', 'admins', 'support']
    });
  }

  async isEnabled(chatMessage, player, server) {
    return server.config.enabledCallAdmin;
  }

  async run(chatMessage, player, server, args) {

    if (!args || !args.length) {
      return chatMessage.reply('callAdminMissingReason');
    }

    const ticketMessage = args.join(' ').trim();

    if (ticketMessage === '') {
      return chatMessage.reply('callAdminMissingReason');
    }

    if (ticketMessage.length > 100) {
      return chatMessage.reply('callAdminTooLong');
    }

    let ticket = await sails.helpers.sdtd.createTicket(
      server.id,
      player.id,
      ticketMessage
    );

    return chatMessage.reply('callAdminSuccess', {
      ticket: ticket
    });
  }
}

module.exports = callAdmin;
