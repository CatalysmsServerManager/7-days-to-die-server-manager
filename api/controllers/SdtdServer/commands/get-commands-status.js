module.exports = {

  friendlyName: 'Get commands status',

  description: '',

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
    const {commandsEnabled} = await SdtdConfig.findOne({ server: inputs.serverId });
    return exits.success(commandsEnabled);
  }
};
