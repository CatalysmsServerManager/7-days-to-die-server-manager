module.exports = {
    friendlyName: 'get bannedItemTiers',


    inputs: {

        serverId: {
            required: true,
            type: 'string'
        }
    },

    exits: {},

    fn: async function (inputs, exits) {
        const tiers = await BannedItemTier.find({ server: inputs.serverId }).populate('role');
        return exits.success(tiers);
    }
};
