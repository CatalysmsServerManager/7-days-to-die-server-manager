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
    await SdtdConfig.update({ server: inputs.serverId }, { commandsEnabled: false });
    return exits.success();

  }
};
