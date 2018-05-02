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
        },

        notLoggedIn: {
            description: '',
            responseType: 'badRequest',
            statusCode: 400
        }

    },



    fn: async function (inputs, exits) {

        try {
            let server = await SdtdServer.findOne(inputs.serverId);
            let listings = await ShopListing.find({ server: inputs.serverId });

            if (_.isUndefined(this.req.session.userId)) {
                return exits.notLoggedIn("You must be logged in to view a shop.")
            }

            let user = await User.findOne(this.req.session.userId);

            let player = await Player.find({ server: server.id, user: user.id }).limit(1)

            server = _.omit(server, 'authName', 'authToken', 'webPort')

            return exits.success({
                server: server,
                listings: listings,
                player: player[0]
            })

        } catch (error) {
            sails.log.error(error);
            return exits.error(error);
        }


    }


};
