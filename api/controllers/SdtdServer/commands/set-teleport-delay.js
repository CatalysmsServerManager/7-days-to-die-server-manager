module.exports = {

    friendlyName: 'Set teleport delay',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },

        delay: {
            type: 'number',
            required: true,
            min: 0,
        }
    },

    exits: {},


    fn: async function (inputs, exits) {

        await SdtdConfig.update({ server: inputs.serverId }, { playerTeleportDelay: inputs.delay });
        return exits.success();

    }
};
