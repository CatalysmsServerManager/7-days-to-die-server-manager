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
    },

    amount: {
      type: 'number',
      min: 1
    }
  },

  exits: {
    success: {},

    invalidId: {
      description: 'The given ID was not found in the DB',
      responseType: 'badRequest',
      statusCode: 400
    },

    notEnoughCurrency: {
      description:
        'The player does not have enough money to play for the listing',
      responseType: 'badRequest',
      statusCode: 400
    }
  },

  fn: async function (inputs, exits) {
    try {
      const player = await Player.findOne(inputs.playerId);
      const listing = await ShopListing.findOne(inputs.listingId);


      if (_.isUndefined(player)) {
        return exits.invalidId('Invalid player ID');
      }

      if (_.isUndefined(listing)) {
        return exits.invalidId('Invalid listing ID');
      }

      inputs.amount = inputs.amount ? inputs.amount : 1;
      let totalCost = listing.price * inputs.amount;

      await sails.helpers.economy.deductFromPlayer(
        player.id,
        totalCost,
        `SHOP - bought ${inputs.amount}x ${listing.name}`
      );

      let itemClaim;
      for (let index = 0; index < inputs.amount; index++) {
        itemClaim = await PlayerClaimItem.create({
          name: listing.name,
          amount: listing.amount,
          quality: listing.quality,
          player: player.id
        }).fetch();
      }

      await ShopListing.update(
        {
          id: inputs.listingId
        },
        {
          timesBought: listing.timesBought + inputs.amount
        }
      );

      sails.log.info(
        `${player.name} has purchased ${inputs.amount} of a listing from shop.`,
        {listing, player}
      );
      return exits.success(itemClaim);
    } catch (error) {

      if (error.message = 'notEnoughCurrency') {
        return exits.notEnoughCurrency('You do not have enough money to buy this!');
      }

      sails.log.error(error, {playerId: inputs.playerId});
      return exits.error(error);
    }
  }
};
