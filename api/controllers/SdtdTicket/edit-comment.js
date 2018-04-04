module.exports = {


    friendlyName: 'Edit comment',


    description: 'Edit a comment in a ticket',


    inputs: {
        commentId: {
            required: true,
            type: 'number'
        },
        newText: {
            required: true,
            type: 'string'
        }
    },


    exits: {
        success: {}
    },


    fn: async function (inputs, exits) {

        await TicketComment.update(
            {
                id: inputs.commentId
            }, {
                commentText: inputs.newText
            }
        )
        return exits.success();

    }


};
