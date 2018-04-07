module.exports = {

    friendlyName: 'Set prefix',

    inputs: {
        serverId: {
            required: true,
            type: 'number'
        },
        prefix: {
            required: true,
            type: 'string'
        }
    },

    exits: {
        success: {},
    },


    fn: async function (inputs, exits) {

        await SdtdConfig.update({ id: inputs.serverId }, { discordPrefix: inputs.prefix });
        return exits.success();

    }
};
