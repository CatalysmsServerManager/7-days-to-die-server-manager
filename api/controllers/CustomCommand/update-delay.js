module.exports = {


    friendlyName: 'Update delay',


    description: '',


    inputs: {
        commandId: {
            type: 'number',
            required: true
        },

        newDelay: {
            type: 'number',
            min: 0,
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
            }, { delay: inputs.newDelay })
            return exits.success();

        } catch (error) {
            sails.log.error(error)
        }

    }


};

