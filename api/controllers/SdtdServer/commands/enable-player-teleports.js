module.exports = {

  friendlyName: 'Enable player teleport commands',

  description: 'Enable the ingame player teleport commands',

  inputs: {
    serverId: {
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
    },
  },


  fn: async function (inputs, exits) {

    await SdtdConfig.update({ server: inputs.serverId }, { enabledPlayerTeleports: true });
    await sails.hooks.sdtdcommands.reload(inputs.serverId);
    return exits.success();

  }
};
