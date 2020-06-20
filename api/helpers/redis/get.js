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

    await sails.helpers.redis.ensureCacheExists();

    return exits.success(sails.cache[inputs.keyString] ? sails.cache[inputs.keyString] : null);
  }

};

