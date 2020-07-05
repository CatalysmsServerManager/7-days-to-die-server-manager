const sevenDays = require('machinepack-7daystodiewebapi');


module.exports = {


  friendlyName: 'listing add',


  description: 'Add a new listing to the shop',


  inputs: {
    serverId: {
      required: true,
      type: 'number'
    },
    name: {
      required: true,
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
      required: true
    },

    quality: {
      type: 'number',
      min: 0
    },

    price: {
      type: 'number',
      required: true,
      min: 0
    },

    customIcon: {
      type: 'string',
      defaultsTo: ''
    }


  },


  exits: {
    success: {},

    invalidItem: {
      description: 'The given item name was not found on the server',
      responseType: 'badRequest',
      statusCode: 400
    }
  },


  fn: async function (inputs, exits) {

    try {
      let validItemName = await sails.helpers.sdtd.validateItemName(inputs.serverId, inputs.name);

      if (!validItemName) {
        return exits.invalidItem('You have provided an invalid item name.');
      }

      if (inputs.quality && inputs.amount > 1) {
        return exits.invalidItem('When setting quality, amount cannot be more than 1');
      }

      let createdListing = await ShopListing.create({
        name: inputs.name,
        friendlyName: inputs.friendlyName,
        amount: inputs.amount,
        quality: inputs.quality,
        price: inputs.price,
        server: inputs.serverId,
        iconName: inputs.customIcon,
      }).fetch();

      sails.log.info(`Created a new listing for server ${inputs.serverId}`, createdListing);
      return exits.success(createdListing);
    } catch (error) {
      sails.log.error(error);
      return exits.error(error);
    }




  }


};
