module.exports = {


  friendlyName: 'Set kill earner zombiekill',


  description: '',



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
      await SdtdConfig.update({ server: inputs.serverId }, { zombieKillReward: inputs.amount });
      await sails.hooks.economy.reload(inputs.serverId, 'killEarner');
      await HistoricalInfo.create({
        type: 'economy',
        economyAction: 'config',
        server: inputs.serverId,
        message: `set zombie kill reward to ${inputs.amount}`
      });
      return exits.success();
    } catch (error) {
      sails.log.error(error);
      return exits.error(error);
    }



  }


};

