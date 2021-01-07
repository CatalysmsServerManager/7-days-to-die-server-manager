
module.exports = {
  friendlyName: 'Add bannedItem',

  description: 'Add an item to the list of bannedItems',

  inputs: {
    name: {
      required: true,
      type: 'string'
    },

    tier: {
      required: true,
      type: 'string'
    },

    serverId: {
      required: true,
      type: 'string'
    }
  },

  exits: {},

  fn: async function (inputs, exits) {
    await BannedItem.create({ name: inputs.name, tier: inputs.tier, server: inputs.serverId });
    return exits.success();
  }
};
