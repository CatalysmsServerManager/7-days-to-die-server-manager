module.exports = {

    friendlyName: 'Check donator',

    description: 'Check if a server is donator or not',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        }
    },

    exits: {
        success: {
        },
    },


    fn: async function (inputs, exits) {
        let donatorStatus = await sails.helpers.meta.checkDonatorStatus(inputs.serverId);
        return exits.success(donatorStatus);

    }
};
