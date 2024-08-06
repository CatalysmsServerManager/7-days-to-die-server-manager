module.exports = {


  friendlyName: 'Get tracking info',


  description: '',


  inputs: {

    serverId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer;
      },
    },

    playerIds: {
      type: 'json',
      custom: (valueToCheck) => _.isArray(valueToCheck)
    },

    beginDate: {
      type: 'number',
      min: 0
    },

    endDate: {
      type: 'number',
      min: 0
    },

    limit: {
      type: 'number',
      min: 1,
      max: 5000
    },

    x: {
      type: 'number',
    },

    z: {
      type: 'number',
    },

    size: {
      type: 'number',
      min: 1
    },

    item: {
      type: 'string',
      minLength: 1
    }

  },


  exits: {
    badRequest: {
      responseType: 'badRequest'
    },
  },


  fn: async function (inputs, exits) {
    const lastTrackingQuery = await sails.helpers.redis.get(`server:${inputs.serverId}:trackingQuery`);

    if (lastTrackingQuery) {
      const lastQuery = new Date(JSON.parse(lastTrackingQuery));
      const now = new Date();

      // If last query is less than 10 seconds ago, return an error
      if (now - lastQuery < 10000) {
        return exits.badRequest("You can only query tracking data every 10 seconds");
      }
    }

    await sails.helpers.redis.set(`server:${inputs.serverId}:trackingQuery`, JSON.stringify(new Date().toISOString()), true, 10);

    let startDate = new Date();

    inputs.beginDate = inputs.beginDate ? inputs.beginDate : new Date(0).valueOf();
    inputs.endDate = inputs.endDate ? inputs.endDate : Date.now();
    inputs.limit = inputs.limit ? inputs.limit : 5000;
    inputs.size = inputs.size ? inputs.size : 100;

    if (inputs.playerIds[0] === 0 || inputs.playerIds[0] === '0') {
      inputs.playerIds = undefined;
    }


    let waterlineQuery = {
      where: {
        server: inputs.serverId,
        player: inputs.playerIds,
        createdAt: {
          '>': inputs.beginDate,
          '<': inputs.endDate,
        }
      },
      sort: 'createdAt DESC',
      limit: inputs.limit
    };

    if (!_.isUndefined(inputs.x) && !_.isUndefined(inputs.z)) {
      let xQuery = {
        '>': inputs.x - inputs.size,
        '<': inputs.x + inputs.size
      };
      let zQuery = {
        '>': inputs.z - inputs.size,
        '<': inputs.z + inputs.size
      };

      waterlineQuery.where.x = xQuery;
      waterlineQuery.where.z = zQuery;

    }

    if (!_.isUndefined(inputs.item)) {
      waterlineQuery.where.inventory = {
        'contains': inputs.item
      };
    }


    let infoToSend = await TrackingInfo.find(waterlineQuery);

    let endDate = new Date();
    sails.log.info(`Loaded ${infoToSend.length} records of player tracking data for server ${inputs.serverId} - Took ${endDate.valueOf() - startDate.valueOf()} ms`, {waterlineQuery, serverId: inputs.serverId});

    return exits.success(infoToSend);

  }


};
