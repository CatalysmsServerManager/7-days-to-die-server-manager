module.exports = {

  friendlyName: 'Get max teleport locations',

  inputs: {
    serverId: {
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
    },
  },


  fn: async function (inputs, exits) {

    let config = await SdtdConfig.findOne({ server: inputs.serverId });
    return exits.success(config.maxPlayerTeleportLocations);

  }
};
