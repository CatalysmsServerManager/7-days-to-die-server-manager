module.exports = {


  friendlyName: 'lpush',

  inputs: {

    keyString: {
      required: true,
      type: 'string'
    },

    value: {
      required: true,
      type: 'json'
    },
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    const client = sails.hooks.redis.client;

    client.lpush(inputs.keyString, inputs.value, (err, reply) => {
      if (err) {
        return exits.error(err);
      }
      return exits.success(reply);
    });
  }

};
