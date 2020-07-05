/**
 * ShopListing.js
 *
 * @description A listing in a server shop
 * @module ShopListing
 */

module.exports = {

  attributes: {

    /**
         * @var name
         * @description name of the item
         * @memberof module:ShopListing
         */

    name: {
      type: 'string',
      required: true
    },

    friendlyName: {
      type: 'string',
    },

    iconName: {
      type: 'string',
      defaultsTo: ''
    },

    /**
         * @var amount
         * @description amount of the item to buy.
         * @memberof module:ShopListing
         */

    amount: {
      type: 'number',
      defaultsTo: 1,
      min: 1
    },

    /**
         * @var quality
         * @description Quality of the item
         * @memberof module:ShopListing
         */

    quality: {
      type: 'number',
      defaultsTo: 0,
      min: 0
    },


    price: {
      type: 'number',
      min: 0,
      required: true
    },

    timesBought: {
      type: 'number',
      defaultsTo: 0
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    /**
         * @var server
         * @description Server this listing belongs to
         * @memberof module:ShopListing
         */

    server: {
      model: 'sdtdserver',
      required: true,
    },

    createdBy: {
      model: 'user'
    }



  },

};
