module.exports = {

  friendlyName: 'Disable commands',

  description: 'Disable the ingame commands',

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

    let config = await SdtdConfig.update({ server: inputs.serverId }, { commandsEnabled: false });
    await sails.hooks.sdtdcommands.stop(inputs.serverId);
    return exits.success();

  }
};
