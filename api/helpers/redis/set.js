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

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    sails.getDatastore('cache').leaseConnection(function during(redisConnection, proceed) {
      redisConnection.set(inputs.keyString, inputs.value ,(err, reply) => {
        if (err) return proceed(err);

        return proceed(undefined, reply)
      })
    }).exec((err, result) => {
      if (err) return exits.error(err);

      return exits.success(result);
    })
  }

};
