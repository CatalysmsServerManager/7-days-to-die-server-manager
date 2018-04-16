module.exports = {

    friendlyName: 'Set currency name',

    description: 'Set the name of a servers currency',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },

        newCurrencyName: {
            type: 'string',
            required: true,
            maxLength: 50,
            minLength: 1
        }
    },

    exits: {
        success: {
        },
    },


    fn: async function (inputs, exits) {

        try {
            await SdtdConfig.update({server: inputs.serverId}, {currencyName: inputs.newCurrencyName});
            return exits.success();
        } catch (error) {
            sails.log.error(`API - Sdtdserver:set-currency-name - ${error}`);
            return exits.error(error);
        }

    }
};
