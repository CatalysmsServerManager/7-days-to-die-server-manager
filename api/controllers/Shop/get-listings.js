module.exports = {


    friendlyName: 'Get listing',


    description: '',


    inputs: {
        listingId: {
            type: 'number'
        },

        serverId: {
            type: 'number'
        }

    },


    exits: {
        success: {},

        invalidIds: {
            description: "Must give either listing or server ID",
            responseType: 'badRequest',
            statusCode: 400
        }
    },


    fn: async function (inputs, exits) {

        try {

            if (_.isUndefined(inputs.listingId) && _.isUndefined(inputs.serverId)) {
                return exits.invalidIds("Must give either listing or server ID")
            }

            let foundListings = await ShopListing.find({
                id: inputs.listingId,
                server: inputs.serverId
            });

            return exits.success(foundListings);
        } catch (error) {
            sails.log.error(error);
            return exits.error(error);
        }




    }


};
