module.exports = {


  friendlyName: 'Del',


  description: 'Delete redis value.',


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
    client.del(inputs.keyString, (err, reply) => {
      if (err) {
        return exits.error(err);
      }
      return exits.success(reply);
    });
  }
};
