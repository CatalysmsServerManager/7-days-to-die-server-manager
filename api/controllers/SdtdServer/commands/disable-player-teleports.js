module.exports = {

  friendlyName: 'Disable player teleport commands',

  description: 'Disable the ingame player teleport commands',

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

    await SdtdConfig.update({ server: inputs.serverId }, { enabledPlayerTeleports: false });
    await sails.hooks.sdtdcommands.reload(inputs.serverId);
    return exits.success();

  }
};
