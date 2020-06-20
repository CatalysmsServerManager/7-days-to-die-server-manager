const Bull = require("bull");

module.exports = {
  friendlyName: 'Returns a bull queue object',
  inputs: {
    queueName: {
      friendlyName: 'what queue is this for',
      required: true,
      example: 'logs'
    }
  },
  sync: true,
  exits: {
    success: {
      outputFriendlyName: 'Success'
    },
  },
  fn: function (inputs, exits) {
    if (process.env.IS_TEST) {
      return exits.success({
        on: function () { },
        process: function () { },
        empty: function () { },
        add: function() {}
      });
    }
    const queue = new Bull(
      `sdtdserver:${inputs.queueName}`,
      process.env.REDISSTRING
    );
    return exits.success(queue);
  }
};
