const sevenDays = require('7daystodie-api-wrapper');


module.exports = {


    friendlyName: 'listing edit',


    description: 'Edit a listing',


    inputs: {
        listingId: {
            required: true,
            type: 'number'
        },
        name: {
            type: 'string',
            isNotEmptyString: true,
        },

        friendlyName: {
            type: 'string',
            isNotEmptyString: true,
        },

        amount: {
            type: 'number',
            min: 1,
        },

        quality: {
            type: 'number',
            min: 0
        },

        price: {
            type: 'number',
            min: 0
        },

        customIcon: {
            type: 'string',
        }
    },


    exits: {
        success: {},

        invalidItem: {
            description: "The given item name was not found on the server",
            responseType: 'badRequest',
            statusCode: 400
        },

        noListingFound: {
            description: "The given listing ID does not correspond to a known record in DB",
            responseType: 'badRequest',
            statusCode: 400
        }
    },


    fn: async function (inputs, exits) {

        try {
            let originalListing = await ShopListing.findOne(inputs.listingId);

            if (_.isUndefined(originalListing)) {
                return exits.noListingFound('Did not find the original listing in DB.');
            }

            // Check if the given name is known ingame
            if (!_.isUndefined(inputs.name)) {
                let validItemName = await sails.helpers.sdtd.validateItemName(originalListing.server, inputs.name);

                if (!validItemName) {
                    return exits.invalidItem('You have provided an invalid item name.');
                }
            }

            let updateObject = _.omit(originalListing, "createdAt", "updatedAt", "createdBy", "server");



            updateObject.friendlyName = !_.isUndefined(inputs.friendlyName) ? inputs.friendlyName : originalListing.friendlyName
            updateObject.name = !_.isUndefined(inputs.name) ? inputs.name : originalListing.name
            updateObject.amount = !_.isUndefined(inputs.amount) ? inputs.amount : originalListing.amount
            updateObject.quality = !_.isUndefined(inputs.quality) ? inputs.quality : originalListing.quality
            updateObject.price = !_.isUndefined(inputs.price) ? inputs.price : originalListing.price
            updateObject.iconName = !_.isUndefined(inputs.customIcon) ? inputs.customIcon : originalListing.customIcon

            if (updateObject.quality && updateObject.amount > 1) {
                return exits.invalidItem('When setting quality, amount cannot be more than 1');
            }

            let updatedListing = await ShopListing.update({ id: inputs.listingId }, updateObject).fetch()

            return exits.success(updatedListing);
        } catch (error) {
            sails.log.error(error);
            return exits.error(error);
        }




    }


};
