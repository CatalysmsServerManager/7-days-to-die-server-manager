module.exports = {

    friendlyName: 'Add country',

    description: 'Add a country to the banned list',

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
            return exits.success();
        } else {
            countryBanConfig.bannedCountries.push(inputs.newCountry);
            await SdtdConfig.update({ server: inputs.serverId }, { countryBanConfig: countryBanConfig })
            return exits.success();
        }




    }
};
