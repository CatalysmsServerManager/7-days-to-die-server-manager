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

    const datastore = sails.getDatastore('cache');
    if (datastore.config.adapter === 'sails-redis') {
      sails.getDatastore('cache').leaseConnection(function during(redisConnection, proceed) {
        redisConnection.del(inputs.keyString, (err, reply) => {
          if (err) {return proceed(err);}

          return proceed(undefined, reply);
        });
      }).exec((err, result) => {
        if (err) {return exits.error(err);}

        return exits.success(result);
      });
    } else {
      sails.cache[inputs.keyString] = null;
      return exits.success();
    }



  }
};
