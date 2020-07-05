module.exports = {

  friendlyName: 'Set prefix',

  description: 'Set the commands prefix',

  inputs: {
    serverId: {
      type: 'number',
      required: true
    },
    prefix: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
    },
  },


  fn: async function (inputs, exits) {

    await SdtdConfig.update({ server: inputs.serverId }, { commandPrefix: inputs.prefix });
    await sails.hooks.sdtdcommands.reload(inputs.serverId);
    return exits.success();

  }
};
