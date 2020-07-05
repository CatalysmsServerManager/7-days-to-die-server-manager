const validator = require('validator');

module.exports = {


  friendlyName: 'Shop export',


  description: '',


  inputs: {
    serverId: {
      type: 'number'
    },
    file: {
      type: 'ref'
    },

  },


  exits: {
    success: {},

    invalidIds: {
      description: 'Must give either listing or server ID',
      responseType: 'badRequest',
      statusCode: 400
    },

    invalidInput: {
      responseType: 'badRequest',
      statusCode: 400
    }
  },


  fn: async function (inputs, exits) {
    let problems = new Array();

    try {
      JSON.parse(inputs.file);
    } catch (error) {
      return exits.invalidInput(`Malformed JSON - ${error}`);
    }

    let newData = JSON.parse(inputs.file);

    for (const newListing of newData) {

      let validItemName = await sails.helpers.sdtd.validateItemName(inputs.serverId, newListing.name);

      if (!validItemName) {
        problems.push(`${newListing.name} is not a valid item name`);
      }

      if (newListing.friendlyName === '') {
        problems.push(`${newListing.friendlyName} is not a valid friendly name for "${newListing.friendlyName}"`);
      }

      if (!validator.isInt(newListing.amount + '', { min: 0 })) {
        problems.push(`${newListing.amount} is not a valid amount for "${newListing.friendlyName}"`);
      }

      if (!validator.isInt(newListing.price + '', { min: 0 })) {
        problems.push(`${newListing.price} is not a valid price for "${newListing.friendlyName}"`);
      }

      if (!validator.isInt(newListing.quality + '', { min: 0, max: 600 })) {
        problems.push(`${newListing.quality} is not a valid quality for "${newListing.friendlyName}"`);
      }

      if (newListing.quality && newListing.amount > 1) {
        problems.push(`When setting quality, amount cannot be more than 1 for "${newListing.friendlyName}"`);
      }

    }

    if (problems.length === 0) {

      await ShopListing.destroy({ server: inputs.serverId });
      await ShopListing.createEach(newData.map(newListing => {
        newListing.server = inputs.serverId;
        return newListing;
      }));
      sails.log.info(`Imported ${newData.length} entries for shop ${inputs.serverId}`);
      return exits.success();
    } else {
      return exits.invalidInput(problems);
    }


  }


};
