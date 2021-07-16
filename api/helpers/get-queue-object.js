const Bull = require('bull');
const Sentry = require('@sentry/node');

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
            // This forces a job to fail when it takes too long
            // This is a fallback, jobs should handle timeouts gracefully themselves
            timeout: 15000
          }
        }
      );

      queue.on('error', errorHandler);
      queue.on('failed', failedHandler);

      queues[queueName] = queue;
      return exits.success(queue);

    }

  }
};


function errorHandler(err) {
  sails.log.error(err);
  Sentry.captureException(err);
}

function failedHandler(job, err) {
  sails.log.error(`Job ${job.id} failed`, err);

  if (job.data.serverId) {
    const user = {};
    user.id = `${process.env.CSMM_HOSTNAME}/sdtdserver/${job.data.serverId}/dashboard`;
    if (job.data.server && job.data.server.name) {
      user.name = job.data.server.name;
    }
    Sentry.setUser(user);
  }

  Sentry.captureException(err, {
    jobData: job.data,
    jobName: job.name,
    jobId: job.id,
  });
}
