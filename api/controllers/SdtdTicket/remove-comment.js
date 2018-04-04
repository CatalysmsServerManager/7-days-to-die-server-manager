module.exports = {


    friendlyName: 'Remove comment',


    description: 'Remove a comment from a ticket',


    inputs: {
        commentId: {
            required: true,
            type: 'number'
        }
    },


    exits: {
        success: {}
    },


    fn: async function (inputs, exits) {

        await TicketComment.destroy({
            id: inputs.commentId
        })
        return exits.success();

    }


};
