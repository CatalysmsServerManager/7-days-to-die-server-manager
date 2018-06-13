module.exports = {


    friendlyName: 'Shop export',


    description: '',


    inputs: {
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

            let foundListings = await ShopListing.find({
                server: inputs.serverId
            });

            this.res.attachment(`shop.json`);

            let jsonExport = JSON.stringify(foundListings);

            return exits.success(jsonExport);
        } catch (error) {
            sails.log.error(error);
            return exits.error(error);
        }




    }


};
