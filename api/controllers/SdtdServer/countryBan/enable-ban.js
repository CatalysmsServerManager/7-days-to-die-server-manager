module.exports = {

    friendlyName: 'Enable ban',

    description: 'Let module ban player instead of kicking',

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

        countryBanConfig.ban = true;

        await SdtdConfig.update({id: config.id}, {countryBanConfig: countryBanConfig});
        sails.log.debug(`Enabled ban for country ban - server ${inputs.serverId}`);
        return exits.success();
    }
};
