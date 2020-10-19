module.exports = {
  friendlyName: 'set bannedItem status',

  description: 'Set the status for bannedItems to enabled or disabled',

  inputs: {
    status: {
      required: true,
      type: 'boolean'
    },

    serverId: {
      required: true,
      type: 'string'
    }
  },

  exits: {},

  fn: async function (inputs, exits) {
    await SdtdConfig.update(
      { server: inputs.serverId },
      { bannedItemsEnabled: inputs.status }
    );

    return exits.success();
  }
};
