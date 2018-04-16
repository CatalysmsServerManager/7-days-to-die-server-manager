module.exports = {

    friendlyName: 'Enable economy',

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

        try {
            await SdtdConfig.update({server: inputs.serverId}, {economyEnabled: true});
            return exits.success();
        } catch (error) {
            sails.log.error(`API - Sdtdserver:enable-economy - ${error}`);
            return exits.error(error);
        }

    }
};
