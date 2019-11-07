module.exports = {
  friendlyName: "Get bannedItems",

  description: "Gets the list of bannedItems",

  inputs: {
    serverId: {
      required: true,
      type: "string"
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

    return exits.success(bannedItems);
  }
};
