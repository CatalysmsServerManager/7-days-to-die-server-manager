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

        serverId: {
            type: 'number',
            required: true
        },

    },


    exits: {
        success: {}
    },


    fn: async function (inputs, exits) {

        try {

            let commandsWithSameName = await CustomCommand.find({
                name: inputs.newName,
                server: inputs.serverId
            })

            if (commandsWithSameName.length > 0) {
                return exits.badName('Invalid name! Please choose another one.')
            }


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
