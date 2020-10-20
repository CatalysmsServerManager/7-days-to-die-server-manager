const redis = require('redis');


module.exports = {
  friendlyName: 'Publish',
  inputs: {
    channel: {
      required: true,
      type: 'string'
    },

    message: {
      required: true,
      type: 'json'
    }
  },

  exits: {

  },

  fn: async function (inputs, exits) {
    const publisher = redis.createClient({ url: process.env.REDISSTRING });
    publisher.publish(inputs.channel, inputs.message);
    publisher.quit();
    return exits.success(publisher);
  }
};
