module.exports = {

    friendlyName: 'Economy view',

    description: '',

    inputs: {
        serverId: {
            description: 'The ID of the server',
            type: 'number',
            required: true
        }
    },

    exits: {
        success: {
            responseType: 'view',
            viewTemplatePath: 'sdtdServer/economy/economy-main'
        }
    },



    fn: async function (inputs, exits) {


        try {
            let server = await SdtdServer.findOne(inputs.serverId);
            let config = await SdtdConfig.findOne({ server: server.id });
            let historicalInfo = await HistoricalInfo.find({
                server: server.id,
                type: 'economy'
            }).populate('player');
            sails.log.info(`VIEW - SdtdServer:economy - Showing economy overview for ${server.name}`);
            return exits.success({
                server: server,
                config: config,
                historicalInfo: historicalInfo
            });
        } catch (error) {
            sails.log.error(`VIEW - SdtdServer:economy - ${error}`);
            throw 'notFound';
        }


    }
};
