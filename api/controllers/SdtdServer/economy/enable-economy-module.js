module.exports = {

  friendlyName: 'Enable economy module',

  description: '',

  inputs: {
    serverId: {
      type: 'number',
      required: true
    },

    moduleType: {
      type: 'string',
      required: true,
      isIn: ['playtimeEarner', 'discordTextEarner', 'killEarner']
    }
  },

  exits: {
    success: {},
  },


  fn: async function (inputs, exits) {

    try {
      let databaseUpdateObject = {};

      switch (inputs.moduleType) {
        case 'playtimeEarner':
          databaseUpdateObject.playtimeEarnerEnabled = true;
          break;
        case 'killEarner':
          databaseUpdateObject.killEarnerEnabled = true;
          break;
        case 'discordTextEarner':
          databaseUpdateObject.discordTextEarnerEnabled = true;
          break;

        default:
          break;
      }

      await SdtdConfig.update({
        server: inputs.serverId
      }, databaseUpdateObject);

      await sails.hooks.economy.start(inputs.serverId, inputs.moduleType);
      await HistoricalInfo.create({
        type: 'economy',
        economyAction: 'config',
        server: inputs.serverId,
        message: `Enabled module ${inputs.moduleType}`
      });



      sails.log.info(`Enabled a ${inputs.moduleType} module for server ${inputs.serverId}`)
      return exits.success();
    } catch (error) {
      sails.log.error(`API - Sdtdserver:enable-economy - ${error}`);
      return exits.error(error);
    }

  }
};
