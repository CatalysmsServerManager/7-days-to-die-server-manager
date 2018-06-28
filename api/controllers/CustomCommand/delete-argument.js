module.exports = {

    friendlyName: 'Delete argument',

    description: '',

    inputs: {
        argumentId: {
            type: 'number',
            required: true
        },


    },

    exits: {
        success: {},
        badCommand: {
            responseType: 'badRequest'
        },

        badName: {
            responseType: 'badRequest'
        },

    },


    fn: async function (inputs, exits) {

        await CustomCommandArgument.destroy(inputs.argumentId);

        return exits.success();

    }
};


