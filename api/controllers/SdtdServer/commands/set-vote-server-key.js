module.exports = {

    friendlyName: 'Set Vote for server Server Key',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },

        serverKey: {
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {
        },
    },


    fn: async function (inputs, exits) {

        await SdtdConfig.update({ server: inputs.serverId }, { voteForServerServerKey: inputs.serverKey });
        sails.log.info(`Set Vote for server Server Key to ${inputs.serverKey} for server ${inputs.serverId}`);
        return exits.success();

    }
};
