module.exports = {
    friendlyName: 'Add bannedItemTier',

    inputs: {
        role: {
            required: true,
            type: 'string'
        },

        serverId: {
            required: true,
            type: 'string'
        },

        command: {
            required: true,
            type: 'string'
        }
    },

    exits: {
        badRequest: {
            description: '',
            statusCode: 400
        },
    },

    fn: async function (inputs, exits) {
        const role = await Role.findOne(inputs.role);

        if (!role) {
            return exits.badRequest('Unknown role');
        }

        const tiersForRole = await BannedItemTier.find({ role: inputs.role });
        if (tiersForRole.length) {
            return exits.badRequest('A tier for this role already exists. You can only create one tier per role');
        }

        await BannedItemTier.create({ server: inputs.serverId, command: inputs.command, role: inputs.role });
        return exits.success();

    }
};
