module.exports = {

    friendlyName: 'Enable calladmin command',

    description: 'Enable the ingame calladmin command',

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

        await SdtdConfig.update({ server: inputs.serverId }, { enabledCallAdmin: true });
        return exits.success();

    }
};
