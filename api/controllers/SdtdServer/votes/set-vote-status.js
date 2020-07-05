module.exports = {

  friendlyName: 'Set status vote',

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

    status: {
      type: 'boolean',
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
      votingEnabled: inputs.status
    });

    return exits.success();

  }
};
