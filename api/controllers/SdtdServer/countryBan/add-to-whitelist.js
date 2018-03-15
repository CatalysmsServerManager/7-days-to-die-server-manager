module.exports = {

    friendlyName: 'Add to whitelist',

    description: 'Add a player to the country ban whitelist',

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
            return exits.success();
        } else {
            countryBanConfig.whiteListedSteamIds.push(inputs.newSteamId);
            await SdtdConfig.update({ server: inputs.serverId }, { countryBanConfig: countryBanConfig })
            return exits.success();
        }




    }
};
