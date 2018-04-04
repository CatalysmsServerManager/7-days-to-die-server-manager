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
        });
        let ticket = await SdtdTicket.findOne(inputs.ticketId);

        await sails.hooks.discordnotifications.sendNotification({
            serverId: ticket.server,
            notificationType: 'ticket',
            ticketNotificationType: 'New comment',
            ticket: ticket
          })
        return exits.success();

    }


};
