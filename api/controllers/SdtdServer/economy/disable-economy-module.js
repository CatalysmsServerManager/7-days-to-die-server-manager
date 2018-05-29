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
            isIn: ['playtimeEarner', 'discordTextEarner', 'killEarner']
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
            sails.log.info(`Disabled a ${inputs.moduleType} module for server ${inputs.serverId}`);
            return exits.success();
        } catch (error) {
            sails.log.error(`API - Sdtdserver:disable-economy - ${error}`);
            return exits.error(error);
        }

    }
};
