module.exports = {


  friendlyName: 'Add comment',


  description: 'Add a comment to a ticket',


  inputs: {
    ticketId: {
      required: true,
      type: 'string'
    },
    commentText: {
      required: true,
      type: 'string'
    }
  },


  exits: {
    success: {}
  },


  fn: async function (inputs, exits) {

    await TicketComment.create({
      commentText: inputs.commentText,
      ticket: inputs.ticketId,
      userThatPlacedTheComment: this.req.session.userId
    }).fetch();
    let ticket = await SdtdTicket.findOne(inputs.ticketId);

    await sails.helpers.discord.sendNotification({
      serverId: ticket.server,
      notificationType: 'ticket',
      ticketNotificationType: 'New comment',
      ticket: ticket
    });

    sails.log.info(`New comment on ticket ${inputs.ticketId}`, {serverId: ticket.server});
    return exits.success();

  }


};
