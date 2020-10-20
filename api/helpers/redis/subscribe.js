const redis = require('redis');

module.exports = {
  friendlyName: 'Subscribe',
  inputs: {
    channel: {
      required: true,
      type: 'string'
    },
  },

  exits: {

  },

  fn: async function (inputs, exits) {

    const subscriber = redis.createClient({ url: process.env.REDISSTRING });

    subscriber.subscribe(inputs.channel);

    return exits.success(subscriber);
  }
};
