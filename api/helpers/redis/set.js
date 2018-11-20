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

    if (process.env.REDISSTRING) {

      if (inputs.ex) {
        if (_.isUndefined(inputs.ttl)) {
          return exits.error(`When settings ex true you must provide a TTL.`)
        }

        sails.getDatastore('cache').leaseConnection(function during(redisConnection, proceed) {
          redisConnection.set(inputs.keyString, inputs.value, 'EX', inputs.ttl, (err, reply) => {
            if (err) return proceed(err);

            return proceed(undefined, reply)
          })
        }).exec((err, result) => {
          if (err) return exits.error(err);

          return exits.success(result);
        })

      } else {

        sails.getDatastore('cache').leaseConnection(function during(redisConnection, proceed) {
          redisConnection.set(inputs.keyString, inputs.value, (err, reply) => {
            if (err) return proceed(err);

            return proceed(undefined, reply)
          })
        }).exec((err, result) => {
          if (err) return exits.error(err);

          return exits.success(result);
        })
      }
    } else {
      return exits.success(sails.cache[inputs.keyString]);
    }

  }

};
