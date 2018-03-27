module.exports = {

    friendlyName: 'Set teleport timeout',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },

        timeout: {
            type: 'number',
            required: true
        }
    },

    exits: {
        success: {
        },
    },


    fn: async function (inputs, exits) {

        await SdtdConfig.update({ server: inputs.serverId }, { playerTeleportTimeout: inputs.timeout });
        return exits.success();

    }
};
