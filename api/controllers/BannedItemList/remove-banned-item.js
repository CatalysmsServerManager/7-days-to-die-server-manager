module.exports = {
  friendlyName: 'Remove bannedItem',

  description: 'Remove an item from the list of bannedItems',

  inputs: {
    bannedItem: {
      required: true,
      type: 'string'
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    await BannedItem.destroy({ id: inputs.bannedItem });
    return exits.success();
  }
};
