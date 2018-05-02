module.exports = {


    friendlyName: 'Serves a servers shop view',


    description: '',


    inputs: {
        serverId: {
            type: 'number',
            required: true
        }
    },


    exits: {

        success: {
            description: '',
            responseType: 'view',
            viewTemplatePath: 'sdtdServer/economy/shop'
        }

    },



    fn: async function (inputs, exits) {

        try {
            let server = await SdtdServer.findOne(inputs.serverId);
            let listings = await ShopListing.find({ server: inputs.serverId });

            server = _.omit(server, 'authName', 'authToken', 'webPort')

            return exits.success({
                server: server,
                listings: listings
            })

        } catch (error) {
            sails.log.error(error);
            return exits.error(error);
        }


    }


};
