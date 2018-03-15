module.exports = {

    friendlyName: 'Remove from whitelist',

    description: 'Remove a player from country ban whitelist',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },
        newSteamId: {
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
        let countryBanConfig = config.countryBanConfig

        if (countryBanConfig.whiteListedSteamIds.includes(inputs.newSteamId)) {
            let idx = countryBanConfig.whiteListedSteamIds.indexOf(inputs.newSteamId);
            let ajdustedWhitelist = countryBanConfig.whiteListedSteamIds.slice(idx);
            countryBanConfig.whiteListedSteamIds = ajdustedWhitelist;
            await SdtdConfig.update({ server: inputs.serverId }, { countryBanConfig: countryBanConfig })
            return exits.success();
        } else {
            return exits.success();
        }




    }
};
