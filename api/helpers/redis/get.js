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
    const client = sails.hooks.redis.client;
    client.get(inputs.keyString, (err, reply) => {
      if (err) {
        return exits.error(err);
      }

      const parsedInt = parseInt(reply, 10);

      if (!Number.isNaN(parsedInt)) {
        return exits.success(parsedInt);

      }

      return exits.success(reply);
    });
  }
};

