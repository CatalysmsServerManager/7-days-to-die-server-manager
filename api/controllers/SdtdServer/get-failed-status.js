module.exports = {

  friendlyName: 'Get failed status',

  description: 'Get the failed counter and last success values for a server',

  inputs: {

    serverId: {
      description: 'Id of the SdtdServer',
      type: 'number',
      required: true
    }

  },

  exits: {

    success: {},


  },


  fn: async function (inputs, exits) {

    let server = await SdtdServer.findOne(inputs.serverId);

    let counter = await sails.helpers.redis.get(`sdtdserver:${server.id}:sdtdLogs:failedCounter`);
    let lastSuccess = await sails.helpers.redis.get(`sdtdserver:${server.id}:sdtdLogs:lastSuccess`);

    if (_.isNull(counter)) {
      counter = 0;
    }
    counter = parseInt(counter);
    lastSuccess = parseInt(lastSuccess);

    return exits.success({
      timesFailed: counter,
      lastSuccess: lastSuccess
    });


  }
};
