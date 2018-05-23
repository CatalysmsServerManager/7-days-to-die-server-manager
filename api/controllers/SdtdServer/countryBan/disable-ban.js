module.exports = {

    friendlyName: 'Disable ban',

    description: '',

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
        let config = await SdtdConfig.findOne({ server: inputs.serverId });
        let countryBanConfig = config.countryBanConfig

        countryBanConfig.ban = false;

        await SdtdConfig.update({id: config.id}, {countryBanConfig: countryBanConfig});
        sails.log.debug(`Disabled ban for country ban - server ${inputs.serverId}`);
        return exits.success();
    }
};
