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
    sails.getDatastore('cache').leaseConnection(function during(redisConnection, proceed) {
      redisConnection.incr(inputs.keyString, (err, reply) => {
        if (err) return proceed(err);

        return proceed(undefined, reply)
      });
    }).exec((err, result) => {
      if (err) return exits.error(err);

      return exits.success(result);
    });
  }
};
