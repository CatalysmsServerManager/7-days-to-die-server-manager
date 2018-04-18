module.exports = {


    friendlyName: 'Update cost',


    description: '',


    inputs: {
        commandId: {
            type: 'number',
            required: true
        },

        newCost: {
            type: 'number',
            min: 0
        },

    },


    exits: {
        success: {}
    },


    fn: async function (inputs, exits) {

        try {
            await CustomCommand.update({
                id: inputs.commandId,
                costToExecute: inputs.newCost
            })
            return exits.success();

        } catch (error) {
            sails.log.error(error)
        }

    }


};
