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
        })
        return exits.success();

    }


};
