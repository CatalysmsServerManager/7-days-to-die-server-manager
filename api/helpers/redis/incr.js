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
    const datastore = sails.getDatastore('cache');
    if (datastore.adapter === 'sails-redis') {
      sails.getDatastore('cache').leaseConnection(function during(redisConnection, proceed) {
        redisConnection.incr(inputs.keyString, (err, reply) => {
          if (err) return proceed(err);

          return proceed(undefined, reply)
        });
      }).exec((err, result) => {
        if (err) return exits.error(err);

        return exits.success(result);
      });
    } else {
      return exits.success(sails.cache[inputs.keyString]++);
    }
  }
};
