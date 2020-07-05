module.exports = {


  friendlyName: 'Ensure cache exists',


  description: 'Makes sure the in memory cache exists',


  inputs: {},


  exits: {

  },


  fn: async function (inputs, exits) {

    if (!sails.cache) {
      sails.cache = {};
    }

    return exits.success();
  }

};

