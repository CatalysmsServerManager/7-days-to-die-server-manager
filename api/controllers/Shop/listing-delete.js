module.exports = {


  friendlyName: 'listing delete',


  description: 'Delete a listing from the shop',


  inputs: {
    listingId: {
      type: 'number',
      required: true
    }
  },


  exits: {
    success: {},
  },


  fn: async function (inputs, exits) {

    try {
      let deletedListing = await ShopListing.destroy(inputs.listingId).fetch();
      return exits.success(deletedListing);
    } catch (error) {
      sails.log.error(error);
      return exits.error(error);
    }

  }


};
