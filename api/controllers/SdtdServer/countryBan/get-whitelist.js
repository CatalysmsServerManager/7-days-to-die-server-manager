module.exports = {

  friendlyName: 'Get countryban whitelist',

  description: 'Get countries that are banned',

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
    return exits.success(config.countryBanConfig.whiteListedSteamIds);

  }
};
