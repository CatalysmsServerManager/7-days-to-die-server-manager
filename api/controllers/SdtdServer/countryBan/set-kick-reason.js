module.exports = {

    friendlyName: 'Set kick reason',

    description: 'Set kick reason for country ban',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },
        newKickreason: {
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {
        },
    },


    fn: async function (inputs, exits) {

        let config = await SdtdConfig.findOne({ server: inputs.serverId });
        let countryBanConfig = config.countryBanConfig;

        countryBanConfig.kickMessage = inputs.newKickreason;
        await SdtdConfig.update({server: inputs.serverId}, {countryBanConfig: countryBanConfig})
        return exits.success()

    }
};
