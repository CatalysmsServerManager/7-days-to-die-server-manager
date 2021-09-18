module.exports = {

  friendlyName: 'Set cost',

  description: 'Set the cost of a certain action',

  inputs: {
    serverId: {
      type: 'number',
      required: true
    },

    costTypeToSet: {
      type: 'string',
      required: true,
      isIn: ['costToTeleport', 'costToSetTeleport', 'costToMakeTeleportPublic', 'costToUseGimme']
    },

    newCost: {
      type: 'number',
      required: true,
      min: 0
    }
  },

  exits: {
    success: {},
  },


  fn: async function (inputs, exits) {

    try {
      let updateObject = new Object();

      updateObject[inputs.costTypeToSet] = inputs.newCost;
      await SdtdConfig.update({
        server: inputs.serverId
      }, updateObject);
      await HistoricalInfo.create({
        type: 'economy',
        economyAction: 'config',
        server: inputs.serverId,
        message: `set ${inputs.costTypeToSet} to ${inputs.newCost}`
      });
      return exits.success();
    } catch (error) {
      sails.log.error(`API - Sdtdserver:set-cost - ${error}`, {serverId: inputs.serverId});
      return exits.error(error);
    }

  }
};
