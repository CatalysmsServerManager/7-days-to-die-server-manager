const DiscordNotification = require('../DiscordNotification');

class Ticket extends DiscordNotification {
  constructor() {
    super('ticket');
  }

  async makeEmbed(event, embed) {
    if (!event.ticketNotificationType) {
      throw new Error('Implementation error! Must provide a ticketNotificationType.');
    }

    if (!event.ticket) {
      throw new Error('Implementation error! Must provide a ticket info.');
    }

    let ticket = await SdtdTicket.findOne(event.ticket.id).populate('comments').populate('player');

    embed.setTitle('Ticket notification')

      .addFields([{
        name: 'Type',
        value: event.ticketNotificationType,
        inline: true
      },
      {
        name: 'Creator',
        value: ticket.player.name,
        inline: true
      }, {
        name: 'Title',
        value: event.ticket.title
      }, {
        name: 'Link',
        value: `${process.env.CSMM_HOSTNAME}/sdtdticket/${event.ticket.id}`
      }])
      .setColor([0, 255, 0]);

    if (event.ticketNotificationType === 'New comment') {
      let latestComment = ticket.comments[ticket.comments.length - 1];
      let latestCommentUser = await User.findOne(latestComment.userThatPlacedTheComment);
      embed.addField(`Latest comment: by ${latestCommentUser.username}`, `${ticket.comments[ticket.comments.length - 1].commentText}`);
    }


    return embed;
  }
}


module.exports = Ticket;
