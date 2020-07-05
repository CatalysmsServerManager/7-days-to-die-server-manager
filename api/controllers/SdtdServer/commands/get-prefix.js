module.exports = {

  friendlyName: 'Get prefix',

  description: 'Get the commands prefix',

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

    let config = await SdtdConfig.findOne({ server: inputs.serverId });
    return exits.success(config.commandPrefix);

  }
};
