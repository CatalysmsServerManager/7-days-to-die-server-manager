module.exports = {


  friendlyName: 'Get memUpdate',

  inputs: {
    serverId: {
      required: true,
      example: 4
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
      description: 'Unix timestamp of when logs should end',
      min: 0,
    }

  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    },

  },

  fn: async function (inputs, exits) {
    let dateStarted = new Date();

    if (_.isUndefined(inputs.beginDate)) {
      inputs.beginDate = 0;
    }

    if (_.isUndefined(inputs.endDate)) {
      inputs.endDate = Date.now();
    }

    if (_.isUndefined(inputs.limit)) {
      inputs.limit = 500;
    }

    let whereObject = {
      server: inputs.serverId,
      createdAt: {
        '>': inputs.beginDate,
        '<': inputs.endDate,
      }
    };

    try {
      let dataToSend = await Analytics.find({
        where: whereObject,
        sort: 'createdAt DESC',
        limit: inputs.limit
      });
      let dateEnded = new Date();
      sails.log.debug(`Retrieved ${dataToSend.length} records of historical data - took ${dateEnded - dateStarted} ms`);
      return exits.success(dataToSend);
    } catch (error) {
      return exits.success(0);
    }
  }


};
