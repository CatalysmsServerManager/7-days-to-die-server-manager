module.exports = {


  friendlyName: 'ltrim',

  inputs: {

    keyString: {
      required: true,
      type: 'string'
    },

    start: {
      required: true,
      type: 'number'
    },

    stop: {
      required: true,
      type: 'number'
    },
  },


  exits: {  },


  fn: async function (inputs, exits) {

    const client = sails.hooks.redis.client;

    client.ltrim(inputs.keyString, inputs.start, inputs.stop, (err, reply) => {
      if (err) {
        return exits.error(err);
      }
      return exits.success(reply);
    });
  }

};
