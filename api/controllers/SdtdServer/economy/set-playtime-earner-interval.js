module.exports = {
  friendlyName: 'Set playtimeEarner interval',

  inputs: {
    serverId: {
      type: 'number',
      required: true
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
        { playtimeEarnerInterval: inputs.interval }
      );
      await sails.hooks.economy.reload(inputs.serverId, 'playtimeEarner');
      await HistoricalInfo.create({
        type: 'economy',
        economyAction: 'config',
        server: inputs.serverId,
        message: `set playtime earner interval to ${inputs.interval}`
      });
      return exits.success();
    } catch (error) {
      sails.log.error(`API set-playtimeEarner-interval - ${error}`);
      return exits.error();
    }
  }
};
