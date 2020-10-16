const DiscordNotification = require('../DiscordNotification');

class Ticket extends DiscordNotification {
  constructor() {
    super('ticket');
  }

  async makeEmbed(event) {
    let client = sails.hooks.discordbot.getClient();
    let embed = new client.customEmbed();

    if (!event.ticketNotificationType) {
      throw new Error('Implementation error! Must provide a ticketNotificationType.');
    }

    if (!event.ticket) {
      throw new Error('Implementation error! Must provide a ticket info.');
    }

    let ticket = await SdtdTicket.findOne(event.ticket.id).populate('comments').populate('player');

    embed.setTitle('Ticket notification')
      .addField('Type', event.ticketNotificationType, true)
      .addField('Creator', ticket.player.name, true)
      .addField('Title', event.ticket.title)
      .addField('Link', `${process.env.CSMM_HOSTNAME}/sdtdticket/${event.ticket.id}`)
      .setColor('GREEN');

    if (event.ticketNotificationType === 'New comment') {
      let latestComment = ticket.comments[ticket.comments.length - 1];
      let latestCommentUser = await User.findOne(latestComment.userThatPlacedTheComment);
      embed.addField(`Latest comment: by ${latestCommentUser.username}`, `${ticket.comments[ticket.comments.length - 1].commentText}`);
    }


    return embed;
  }
}


module.exports = Ticket;
