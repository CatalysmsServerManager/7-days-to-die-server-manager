module.exports = {


  friendlyName: 'INCR',


  description: 'Increment a redis value.',


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

    if (!sails.cache[inputs.keyString]) {
      sails.cache[inputs.keyString] = 0;
    }

    return exits.success(sails.cache[inputs.keyString]++);
  }
};
