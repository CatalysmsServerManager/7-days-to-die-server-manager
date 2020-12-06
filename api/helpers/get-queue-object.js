const Bull = require('bull');

// Keep track of queues that have already been created
// This avoids creating new redis connections for each call
const queues = {};

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

    if (queues[queueName]) {
      return exits.success(queues[queueName]);
    } else {
      const queue = new Bull(
        queueName,
        process.env.REDISSTRING,
        {
          defaultJobOptions: {
            removeOnComplete: 1000,
            removeOnFail: 1000,
            timeout: 3000
          }
        }
      );
      queues[queueName] = queue;
      return exits.success(queue);

    }

  }
};
