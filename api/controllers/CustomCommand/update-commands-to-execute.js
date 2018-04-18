module.exports = {


    friendlyName: 'Update commands to execute',


    description: '',


    inputs: {
        commandId: {
            type: 'number',
            required: true
        },


        newCommandsToExecute: {
            type: 'string',
            minLength: 1,
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
                commandsToExecute: inputs.newCommandsToExecute
            })
            return exits.success();

        } catch (error) {
            sails.log.error(error)
        }

    }


};

