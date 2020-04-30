const Bull = require("bull");

module.exports = {
  friendlyName: 'Returns a bull queue object',
  inputs: {
    serverId: {
      friendlyName: 'Server ID',
      required: true,
      example: 1
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
        on: function() {},
        process: function() {}
      });
    }
    const queue = new Bull(
      `sdtdserver:${inputs.serverId}:logs`,
      process.env.REDISSTRING
    );
    return exits.success(queue);
  }
};
