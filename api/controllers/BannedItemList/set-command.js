module.exports = {
  friendlyName: "set bannedItem command",

  description: "Set the command for bannedItems to execute",

  inputs: {
    command: {
      required: true,
      type: "string"
    },

    serverId: {
      required: true,
      type: "string"
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    await SdtdConfig.update(
      { server: inputs.serverId },
      { bannedItemsCommand: inputs.command }
    );
    return exits.success();
  }
};
