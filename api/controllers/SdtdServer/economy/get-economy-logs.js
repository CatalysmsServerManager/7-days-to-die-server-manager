module.exports = {

  friendlyName: 'Get economy logs',

  description: '',

  inputs: {
    serverId: {
      description: 'The ID of the server',
      type: 'number',
      required: true
    },

    limit: {
      description: 'Limit the amount of lines to get',
      type: 'number',
      min: 1,
      max: 100000
    },

    beginDate: {
      type: 'number',
      description: 'Unix timestamp of when logs should start',
      min: 0
    },

    endDate: {
      type: 'number',
      description: "Unix timestamp of when logs should end",
      min: 0,
    }
  },

  exits: {
    success: {}
  },



  fn: async function (inputs, exits) {
    try {
      let dateStarted = Date.now();

      if (_.isUndefined(inputs.beginDate)) {
        inputs.beginDate = 0
      }

      if (_.isUndefined(inputs.endDate)) {
        inputs.endDate = Date.now();
      }

      if (_.isUndefined(inputs.limit)) {
        inputs.limit = 5000
      }

      let whereObject = {
        server: inputs.serverId,
        type: 'economy',
        createdAt: {
          '>': inputs.beginDate,
          '<': inputs.endDate,
        }
      }

      let totalLogs = 0;

      let historicalInfo = await HistoricalInfo.find({
        where: whereObject,
        limit: inputs.limit,
        sort: "createdAt DESC"
      }).populate('player');

      let dateEnded = Date.now()
      sails.log.info(`API - SdtdServer:economy:get-economy-logs - Got ${historicalInfo.length} records of economy logs for server ${inputs.serverId} - Took ${dateEnded - dateStarted} ms`);

      return exits.success(historicalInfo);

    } catch (error) {
      sails.log.error(`API - SdtdServer:economy:get-economy-logs - ${error}`);
      throw 'notFound';
    }


  }
};
