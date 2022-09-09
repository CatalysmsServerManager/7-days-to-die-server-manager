module.exports = {

  friendlyName: 'Check donator',

  description: 'Check if a server is donator or not',

  inputs: {
    serverId: {
      type: 'string',
    },

    userId: {
      type: 'string'
    },

    reload: {
      type: 'boolean',
      defaultsTo: false,
    }
  },

  exits: {
    success: {},
    badInput: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs, exits) {


    if (_.isUndefined(inputs.serverId) && _.isUndefined(inputs.userId)) {
      return exits.badInput(`Must provide serverId OR userId parameter.`);
    }

    let donatorStatus = await sails.helpers.meta.checkDonatorStatus(inputs.serverId, inputs.userId, inputs.reload);

    if (donatorStatus && donatorStatus !== 'free') {
      await SdtdServer.update({ id: inputs.serverId }, { disabled: false });
    }

    return exits.success(donatorStatus);

  }
};
