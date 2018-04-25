module.exports = {

    friendlyName: 'Disable economy module',

    description: '',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        },

        moduleType: {
            type: 'string',
            required: true,
            isIn: ['playtimeEarner', 'discordTextEarner']
        }
    },

    exits: {
        success: {
        },
    },


    fn: async function (inputs, exits) {

        try {
            await sails.hooks.economy.stop(inputs.serverId, inputs.moduleType)
            await HistoricalInfo.create({
                type: 'economy',
                economyAction: 'config',
                server: inputs.serverId,
                message: `Disabled module ${inputs.moduleType}`
            });
            return exits.success();
        } catch (error) {
            sails.log.error(`API - Sdtdserver:disable-economy - ${error}`);
            return exits.error(error);
        }

    }
};
