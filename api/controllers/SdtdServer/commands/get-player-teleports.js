module.exports = {

    friendlyName: 'Get player teleport command status',

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

        let sdtdConfig = await SdtdConfig.findOne({ server: inputs.serverId });
        return exits.success(sdtdConfig.enabledPlayerTeleports);

    }
};
