module.exports = {


  friendlyName: 'Load land claims',


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

    playerId: {
      type: 'number',
      custom: async (valueToCheck) => {
        let foundPlayer = await Player.findOne(valueToCheck);
        return foundPlayer;
      },
    },

  },


  exits: {
  },


  fn: async function (inputs, exits) {
    const server = await SdtdServer.findOne(inputs.serverId);
    const apiConfig = SdtdServer.getAPIConfig(server);

    if (inputs.playerId) {
      let player = await Player.findOne(inputs.playerId);
      const res = await sails.helpers.sdtdApi.getLandClaims(
        apiConfig,
        player.steamId
      );
      return exits.success(res);
    } else {
      const res = await sails.helpers.sdtdApi.getLandClaims(apiConfig);
      return exits.success(res);
    }
  },
};
