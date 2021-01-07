module.exports = {
    friendlyName: 'Delete bannedItemTier',

    inputs: {
        tierId: {
            required: true,
            type: 'string'
        },

    },

    exits: {
        badRequest: {
            description: '',
            statusCode: 400
        },
    },

    fn: async function (inputs, exits) {
        await BannedItemTier.destroy({ id: inputs.tierId });
        return exits.success();

    }
};
