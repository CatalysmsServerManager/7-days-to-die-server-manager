module.exports = {

  friendlyName: 'Enable commands',

  description: 'Enable the ingame commands',

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
    await SdtdConfig.update({ server: inputs.serverId }, { commandsEnabled: true });
    await sails.hooks.sdtdcommands.start(inputs.serverId);
    return exits.success();

  }
};
