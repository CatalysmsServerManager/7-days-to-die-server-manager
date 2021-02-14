module.exports = {


  friendlyName: 'Remove repeatable logs job',


  inputs: {

    serverId: {
      required: true,
      type: 'string'
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    const queue = sails.helpers.getQueueObject('logs');
    await queue.removeRepeatable({
      jobId: inputs.serverId,
      every: sails.config.custom.logCheckInterval,
    });
    // Make sure the job is also deleted if the server is in slowmode
    await queue.removeRepeatable({
      jobId: inputs.serverId,
      every: sails.config.custom.logCheckIntervalSlowMode,
    });
    return exits.success();
  }
};
