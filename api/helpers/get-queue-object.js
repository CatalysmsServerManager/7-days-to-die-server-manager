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
    if (process.env.IS_TEST) {
      return exits.success(mockQueue);
    }
    const queue = new Bull(
      `sdtdserver:${inputs.queueName}`,
      process.env.REDISSTRING
    );
    return exits.success(queue);
  }
};

// I don't like this approach
// we should use a real Bull queue with in memory Redis or something
// Blocked by https://github.com/OptimalBits/bull/issues/962 I guess
const mockQueue = {
  jobs: [],
  on: function () { },
  process: function () { },
  empty: function () { },
  add: function (data, options) {
    const job = {
      data,
      options,
      remove: () => this.removeJob(data)
    };
    this.jobs.push(job);
    return job;
  },
  getJobs: function () {
    return this.jobs;
  },
  reset: function () {
    this.jobs = [];
  },
  removeJob: function (data) {
    this.jobs = this.jobs.filter(_ => _.data !== data);
  }
};
