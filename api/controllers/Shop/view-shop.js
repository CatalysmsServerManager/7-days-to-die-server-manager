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
            let server = await SdtdServer.findOne(inputs.serverId).populate('admins');
            let listings = await ShopListing.find({ server: inputs.serverId });
            
            if (_.isUndefined(this.req.session.userId)) {
                return exits.notLoggedIn("You must be logged in to view a shop.")
            }

            let user = await User.findOne(this.req.session.userId);

            let player = await Player.find({ server: server.id, user: user.id }).limit(1)

            if (player.length === 0) {
                return exits.notLoggedIn('Not a valid player profile. Make sure you have logged in to this server. If you think this message is a mistake, please report this issue.')
            }

            let isAdmin = false;

            if (server.owner === user.id) {
                isAdmin = true
            }

            server.admins.forEach(adminProfile => {
                if (adminProfile.id === user.id) {
                    isAdmin = true
                }
            })

            server = _.omit(server, 'authName', 'authToken', 'webPort')

            return exits.success({
                server: server,
                listings: listings,
                player: player[0],
                user: user,
                isAdmin: isAdmin
            })

        } catch (error) {
            sails.log.error(error);
            return exits.error(error);
        }


    }


};
