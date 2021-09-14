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

    x: {
      type: 'number',
    },

    z: {
      type: 'number',
    },

    beginDate: {
      type: 'number',
      min: 0
    },

    endDate: {
      type: 'number',
      min: 0
    },


    radius: {
      type: 'number',
      min: 1
    },

    limit: {
      type: 'number',
      min: 1,
      max: 5000
    }


  },


  exits: {
  },


  fn: async function (inputs, exits) {

    let startDate = new Date();

    inputs.beginDate = inputs.beginDate ? inputs.beginDate : new Date(0).valueOf();
    inputs.endDate = inputs.endDate ? inputs.endDate : Date.now();
    inputs.x = inputs.x ? inputs.x : 0;
    inputs.z = inputs.z ? inputs.z : 0;
    inputs.radius = inputs.radius ? inputs.radius : 50;
    inputs.limit = inputs.limit ? inputs.limit : 5000;

    let infoToSend = await TrackingInfo.find({
      where: {
        server: inputs.serverId,
        x: {
          '>': inputs.x - inputs.radius,
          '<': inputs.x + inputs.radius
        },
        z: {
          '>': inputs.z - inputs.radius,
          '<': inputs.z + inputs.radius
        },
        createdAt: {
          '>': inputs.beginDate,
          '<': inputs.endDate,
        }
      },
      sort: 'createdAt ASC',
      limit: inputs.limit
    });

    let endDate = new Date();
    sails.log.info(`Loaded ${infoToSend.length} records of player tracking data for server ${inputs.serverId}. Searched for ${inputs.x} ${inputs.z} and radius ${inputs.radius} - Took ${endDate.valueOf() - startDate.valueOf()} ms`, {serverId: inputs.serverId});

    return exits.success(infoToSend);

  }


};
