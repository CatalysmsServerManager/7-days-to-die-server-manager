module.exports = {


  friendlyName: 'Get',


  description: 'Get redis value.',


  inputs: {

    keyString: {
      required: true,
      type: 'string'
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    if (!sails.cache) {
      sails.cache = {};
    }

    return exits.success(sails.cache[inputs.keyString] ? sails.cache[inputs.keyString] : null);
  }

};

