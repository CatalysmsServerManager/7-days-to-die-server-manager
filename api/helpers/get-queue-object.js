const Bull = require('bull');

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
    let queueName = `sdtdserver:${inputs.queueName}`;
    if (process.env.IS_TEST) {
      queueName += ':test';
    }
    const queue = new Bull(
      queueName,
      process.env.REDISSTRING
    );
    return exits.success(queue);
  }
};
