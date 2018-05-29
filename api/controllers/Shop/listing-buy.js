module.exports = {


    friendlyName: 'listing buy',


    description: 'Player buys a listing',


    inputs: {
        listingId: {
            type: 'number',
            required: true
        },

        playerId: {
            type: 'number',
            required: true
        }
    },


    exits: {
        success: {},

        invalidId: {
            description: "The given ID was not found in the DB",
            responseType: 'badRequest',
            statusCode: 400
        },

        notEnoughCurrency: {
            description: "The player does not have enough money to play for the listing",
            responseType: 'badRequest',
            statusCode: 400
        }
    },


    fn: async function (inputs, exits) {

        try {

            let player = await Player.findOne(inputs.playerId);
            let listing = await ShopListing.findOne(inputs.listingId);

            if (_.isUndefined(player)) {
                return exits.invalidId("Invalid player ID");
            }

            if (_.isUndefined(listing)) {
                return exits.invalidId('Invalid listing ID');
            }


            if (player.currency < listing.price) {
                return exits.notEnoughCurrency("You do not have enough money to buy this!")
            }

            await sails.helpers.economy.deductFromPlayer(player.id, listing.price, `SHOP - bought ${listing.amount}x ${listing.name}`);
            let itemClaim = await PlayerClaimItem.create({
                name: listing.name,
                amount: listing.amount,
                quality: listing.quality,
                player: player.id
            }).fetch();

            await ShopListing.update({ id: inputs.listingId }, {
                timesBought: listing.timesBought + 1
            });

            sails.log.info(`${player.name} has purchased a listing from shop.`, listing);
            return exits.success(itemClaim)
        } catch (error) {
            sails.log.error(error);
            return exits.error(error)
        }

    }


};
