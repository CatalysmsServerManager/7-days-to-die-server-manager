module.exports = {

  friendlyName: 'Set vote status',

  description: '',

  inputs: {
    serverId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer
      },
    },

    status: {
      type: "boolean",
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
      enabledVote: inputs.status
    });

    sails.log.info(`Set status of vote command to ${inputs.status} for server ${inputs.serverId}`);

    return exits.success();

  }
};
