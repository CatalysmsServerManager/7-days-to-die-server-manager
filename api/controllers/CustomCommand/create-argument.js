module.exports = {

    friendlyName: 'Create argument',

    description: '',

    inputs: {
        commandId: {
            type: 'number',
            required: true
        },

        key: {
            type: 'string',
            required: true
        },

        type: {
            type: 'string',
            isIn: ['number', 'text', 'setValues'],
            required: true
        },

        required: {
            type: 'boolean'
        },

        default: {
            type: 'string'
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

        inputs.key = _.toLower(inputs.key);

        let existingArg = await CustomCommandArgument.find({
            key: inputs.key,
            command: inputs.commandId
        });

        if (existingArg.length > 0) {
            return exits.badName('An argument with this key already belongs to this command.')
        }

        if (inputs.key === "steamid" || inputs.key === "entityid") {
            return exits.badCommand('You cannot use reserved names for argument names.')
        }

        if (!inputs.required && _.isUndefined(inputs.default)) {
            return exits.badCommand('If an argument is not required, you must provide a default value.')
        }

        let createdArgument = await CustomCommandArgument.create({
            key: inputs.key,
            type: inputs.type,
            required: inputs.required,
            defaultValue: inputs.default,
            command: inputs.commandId
        }).fetch();

        return exits.success(createdArgument)

    }
};


