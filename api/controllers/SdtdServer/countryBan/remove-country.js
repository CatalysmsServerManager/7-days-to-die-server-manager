module.exports = {

    friendlyName: 'Remove country',

    description: 'Remove a country from the banned list',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },
        newCountry: {
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

        if (countryBanConfig.bannedCountries.includes(inputs.newCountry)) {
            let idx = countryBanConfig.bannedCountries.indexOf(inputs.newCountry);
            let adjustedCountries = _.without(countryBanConfig.bannedCountries, inputs.newCountry);
            countryBanConfig.bannedCountries = adjustedCountries;
            await SdtdConfig.update({ server: inputs.serverId }, { countryBanConfig: countryBanConfig })
            await sails.hooks.countryban.reload(inputs.serverId);
            return exits.success();
        } else {
            return exits.success();
        }




    }
};
