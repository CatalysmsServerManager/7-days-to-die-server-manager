module.exports = {

  friendlyName: 'Set discordTextEarner amount',

  inputs: {
    serverId: {
      type: 'number',
      required: true
    },

    amount: {
      type: 'number',
      required: true,
      min: 0
    }
  },

  exits: {
  },


  fn: async function (inputs, exits) {

    try {
      await SdtdConfig.update({ server: inputs.serverId }, { discordTextEarnerAmountPerMessage: inputs.amount });
      await sails.hooks.economy.reload(inputs.serverId, 'discordTextEarner');
      await HistoricalInfo.create({
        type: 'economy',
        economyAction: 'config',
        server: inputs.serverId,
        message: `set discord text earner amount to ${inputs.amount}`
      });
      return exits.success();
    } catch (error) {
      sails.log.error(`API set-discordTextEarner-amount - ${error}`);
      return exits.error();
    }



  }
};
