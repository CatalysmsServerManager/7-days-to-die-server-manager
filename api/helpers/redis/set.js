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

    const client = sails.hooks.redis.client;

    if (inputs.ex) {
      client.set(inputs.keyString, inputs.value, 'EX', inputs.ttl, (err, reply) => {
        if (err) {
          return exits.error(err);
        }
        return exits.success(reply);
      });
    } else {
      client.set(inputs.keyString, inputs.value, (err, reply) => {
        if (err) {
          return exits.error(err);
        }
        return exits.success(reply);
      });
    }




  }

};
