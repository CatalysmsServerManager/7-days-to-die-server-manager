module.exports = {
  friendlyName: 'Add bannedItem',

  description: 'Add an item to the list of bannedItems',

  inputs: {
    bannedItem: {
      required: true,
      type: 'string'
    },

    serverId: {
      required: true,
      type: 'string'
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    let { bannedItems } = await SdtdConfig.findOne({ server: inputs.serverId });

    try {
      bannedItems = JSON.parse(bannedItems);
    } catch (error) {
      bannedItems = [];
    }

    bannedItems.push(inputs.bannedItem);

    await SdtdConfig.update(
      { server: inputs.serverId },
      { bannedItems: JSON.stringify(bannedItems) }
    );
    return exits.success();
  }
};
