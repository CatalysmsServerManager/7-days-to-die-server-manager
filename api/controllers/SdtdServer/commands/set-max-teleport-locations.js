module.exports = {

    friendlyName: 'Set max teleport locations',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },

        maxLocations: {
            type: 'number',
            required: true
        }
    },

    exits: {
        success: {
        },
    },


    fn: async function (inputs, exits) {

        await SdtdConfig.update({ server: inputs.serverId }, { maxPlayerTeleportLocations: inputs.maxLocations });
        return exits.success();

    }
};
