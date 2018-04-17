module.exports = {

    friendlyName: 'Enable economy module',

    description: '',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },

        moduleType: {
            type: 'string',
            required: true,
            isIn: ['playtimeEarner']
        }
    },

    exits: {
        success: {
        },
    },


    fn: async function (inputs, exits) {

        try {
            await sails.hooks.economy.start(inputs.serverId, inputs.moduleType);
            await HistoricalInfo.create({
                type: 'economy',
                economyAction: 'config',
                server: inputs.serverId,
                message: `Enabled module ${inputs.moduleType}`
            });
            return exits.success();
        } catch (error) {
            sails.log.error(`API - Sdtdserver:enable-economy - ${error}`);
            return exits.error(error);
        }

    }
};
