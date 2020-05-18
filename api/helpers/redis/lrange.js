module.exports = {


  friendlyName: 'Get',


  description: 'Get redis value.',


  inputs: {

    keyString: {
      required: true,
      type: 'string'
    },

    startIndex: {
      type: 'number',
      defaultsTo: 0
    },

    endIndex: {
      type: 'number',
      defaultsTo: 10000000
    }



  },


  exits: {

  },


  fn: async function (inputs, exits) {
    const datastore = sails.getDatastore('cache');
    if (datastore.adapter === 'sails-redis') {
      sails.getDatastore('cache').leaseConnection(function during(redisConnection, proceed) {
        redisConnection.lrange(inputs.keyString, inputs.startIndex, inputs.endIndex, (err, reply) => {
          if (err) return proceed(err);

          return proceed(undefined, reply)
        });
      }).exec((err, result) => {
        if (err) return exits.error(err);

        return exits.success(result);
      });
    } else {
      return exits.success(sails.cache[inputs.keyString].slice(inputs.startIndex, inputs.endIndex));
    }
  }
};
