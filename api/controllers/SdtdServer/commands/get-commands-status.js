module.exports = {

    friendlyName: 'Get commands status',

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
        let hookStatus = sails.hooks.sdtdcommands.getStatus(inputs.serverId);
        let status = (sdtdConfig.commandsEnabled && hookStatus)
        return exits.success(status);

    }
};
