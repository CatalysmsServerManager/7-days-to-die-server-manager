module.exports = {


  friendlyName: 'Get FPS',

  inputs: {
    serverId: {
      required: true,
      example: 4
    }

  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    },

  },

  fn: async function (inputs, exits) {

    let dateStarted = new Date();

    try {
      let dataToSend = await Analytics.find({
        where: {
          server: inputs.serverId,
        },
        limit: 5000
      });
      let dateEnded = new Date();
      sails.log.debug(`Retrieved FPS data - took ${dateEnded - dateStarted} ms`, {serverId: inputs.serverId});
      return exits.success(dataToSend.map(dataPoint => {
        return {
          createdAt: dataPoint.createdAt,
          fps: dataPoint.fps
        };
      }));

    } catch (error) {
      return exits.success(0);
    }
  }


};
