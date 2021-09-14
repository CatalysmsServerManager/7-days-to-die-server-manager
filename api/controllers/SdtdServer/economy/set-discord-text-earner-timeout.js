module.exports = {

  friendlyName: 'Set discordTextEarner timeout',

  inputs: {
    serverId: {
      type: 'number',
      required: true
    },

    timeout: {
      type: 'number',
      required: true,
      min: 0
    }
  },

  exits: {
  },


  fn: async function (inputs, exits) {

    try {
      await SdtdConfig.update({ server: inputs.serverId }, { discordTextEarnerTimeout: inputs.timeout });
      await sails.hooks.economy.reload(inputs.serverId, 'discordTextEarner');
      await HistoricalInfo.create({
        type: 'economy',
        economyAction: 'config',
        server: inputs.serverId,
        message: `set discord text earner timeout to ${inputs.timeout}`
      });
      return exits.success();
    } catch (error) {
      sails.log.error(`API set-discordTextEarner-timeout - ${error}`, {serverId: inputs.serverId});
      return exits.error();
    }



  }
};
