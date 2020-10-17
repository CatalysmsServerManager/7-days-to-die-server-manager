module.exports = {

  friendlyName: 'Enable country whitelist',

  description: 'Set the country banlist to act as a whitelist',

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
    let countryBanListMode = config.countryBanListMode;

    countryBanListMode = true;

    await SdtdConfig.update({id: config.id}, {countryBanListMode: countryBanListMode});
    sails.log.debug(`Set the ban list mode to whitelist for country ban - server ${inputs.serverId}`);
    return exits.success();
  }
};
