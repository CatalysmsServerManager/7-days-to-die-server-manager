module.exports = {


  friendlyName: 'Set kill earner playerkill',


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
      await SdtdConfig.update({ server: inputs.serverId }, { playerKillReward: inputs.amount });
      await sails.hooks.economy.reload(inputs.serverId, 'killEarner');
      await HistoricalInfo.create({
        type: 'economy',
        economyAction: 'config',
        server: inputs.serverId,
        message: `set player kill reward to ${inputs.amount}`
      });
      return exits.success();
    } catch (error) {
      sails.log.error(error, {serverId: inputs.serverId});
      return exits.error(error);
    }



  }


};

