module.exports = {

  friendlyName: 'Load all players',

  description: 'Loads data about all players associated with a server',

  inputs: {
    serverId: {
      required: true,
      example: 4
    }

  },

  exits: {},

  fn: async function (inputs, exits) {
    let sdtdServer = await SdtdServer.findOne(inputs.serverId);

    if (_.isUndefined(sdtdServer)) {
      return exits.error(new Error(`Did not find a server with id ${inputs.serverId}`));
    }

    try {

      let players = await sails.helpers.sdtd.loadAllPlayerData(sdtdServer.id);
      return exits.success(players);

    } catch (error) {
      return exits.error(error)
    }

  }


};
