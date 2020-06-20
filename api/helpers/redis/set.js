module.exports = {


  friendlyName: 'Set',


  description: 'Set redis value.',


  inputs: {

    keyString: {
      required: true,
      type: 'string'
    },

    value: {
      required: true,
      type: 'string'
    },

    ex: {
      type: 'boolean'
    },

    ttl: {
      type: 'number',
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    await sails.helpers.redis.ensureCacheExists();

    sails.cache[inputs.keyString] = inputs.value;
    return exits.success();
  }

};
