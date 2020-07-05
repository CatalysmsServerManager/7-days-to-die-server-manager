module.exports = {

  friendlyName: 'Set vote apiKey',

  description: '',

  inputs: {
    serverId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer;
      },
    },

    apiKey: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {},
  },


  fn: async function (inputs, exits) {

    await SdtdConfig.update({
      server: inputs.serverId
    }, {
      votingApiKey: inputs.apiKey
    });

    return exits.success();

  }
};
