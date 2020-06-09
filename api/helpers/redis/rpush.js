module.exports = {


  friendlyName: 'rpush',


  description: 'RPUSH redis command.',


  inputs: {

    keyString: {
      required: true,
      type: 'string'
    },

    value: {
      required: true,
      type: 'string'
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    const datastore = sails.getDatastore('cache');
    if (datastore.config.adapter === 'sails-redis') {
      sails.getDatastore('cache').leaseConnection(function during(redisConnection, proceed) {
        redisConnection.rpush(inputs.keyString, inputs.value, (err, reply) => {
          if (err) return proceed(err);
          return proceed(undefined, reply)
        });
      }).exec((err, result) => {
        if (err) return exits.error(err);

        return exits.success(result);
      });
    } else {
      sails.cache[inputs.keyString].push(inputs.value);
      return exits.success(sails.cache[inputs.keyString]);
    }
  }
};
