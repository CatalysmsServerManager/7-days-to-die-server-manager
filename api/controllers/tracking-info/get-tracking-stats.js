module.exports = {


  friendlyName: 'Get tracking stats',


  description: '',


  inputs: {

    serverId: {
      type: 'number',
      custom: async (valueToCheck) => {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer;
      },
    },

    playerId: {
      type: 'number',
      custom: async (valueToCheck) => {
        let foundPlayer = await Player.findOne(valueToCheck);
        return foundPlayer;
      },
    }

  },


  exits: {

    badInput: {
      statusCode: 400
    }
  },


  fn: async function (inputs, exits) {

    if (!inputs.serverId && !inputs.playerId) {
      return exits.badInput(`Must provide either a server or player ID`);
    }

    let stats = {};

    stats.amount = await TrackingInfo.count({ server: inputs.serverId, player: inputs.playerId });
    stats.oldest = await TrackingInfo.find({
      where: {
        server: inputs.serverId,
      },
      select: ['createdAt'],
      sort: 'createdAt ASC', limit: 1
    });
    stats.newest = await TrackingInfo.find({
      where: {
        server: inputs.serverId,
      },
      select: ['createdAt'],
      sort: 'createdAt DESC', limit: 1
    });

    return exits.success(stats);

  }


};
