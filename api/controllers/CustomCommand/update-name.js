module.exports = {


    friendlyName: 'Update command',


    description: '',


    inputs: {
        commandId: {
            type: 'number',
            required: true
        },

        newName: {
            type: 'string',
            minLength: 1,
            maxLength: 20,
            required: true
        },

    },


    exits: {
        success: {}
    },


    fn: async function (inputs, exits) {

        try {
            await CustomCommand.update({
                id: inputs.commandId,
            }, {
                name: inputs.newName
            })
            return exits.success();

        } catch (error) {
            sails.log.error(error)
        }

    }


};
