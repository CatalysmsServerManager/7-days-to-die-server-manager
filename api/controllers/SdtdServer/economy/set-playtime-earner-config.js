module.exports = {
  friendlyName: 'Set playtimeEarner amount',

  inputs: {
    serverId: {
      type: 'number',
      required: true
    },

    amount: {
      type: 'number',
      required: true,
      min: 1
    },

    interval: {
      type: 'number',
      required: true,
      min: 1
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    try {
      await SdtdConfig.update(
        { server: inputs.serverId },
        {
          playtimeEarnerAmount: inputs.amount,
          playtimeEarnerInterval: inputs.interval
        }
      );
      await sails.hooks.economy.reload(inputs.serverId, 'playtimeEarner');
      await HistoricalInfo.create({
        type: 'economy',
        economyAction: 'config',
        server: inputs.serverId,
        message: `set playtime earner amount to ${inputs.amount}`
      });
      return exits.success();
    } catch (error) {
      sails.log.error(`API set-playtimeEarner-amount - ${error}`, {serverId: inputs.serverId});
      return exits.error();
    }
  }
};
