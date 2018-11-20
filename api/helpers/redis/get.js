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

    if (process.env.REDISSTRING) {
      sails.getDatastore('cache').leaseConnection(function during(redisConnection, proceed) {
        redisConnection.get(inputs.keyString, (err, reply) => {
          if (err) return proceed(err);
  
          return proceed(undefined, reply)
        });
      }).exec((err, result) => {
        if (err) return exits.error(err);
  
        return exits.success(result);
      });
    } else {
      return exits.success(sails.cache[inputs.keyString]);
    }
    


  }
};

