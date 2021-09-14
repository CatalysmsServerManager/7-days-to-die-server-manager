module.exports = {


  friendlyName: 'set ping kicker status',


  description: '',


  inputs: {
    serverId: {
      required: true,
      type: 'string'
    },
    status: {
      required: true,
      type: 'boolean',
    }
  },


  exits: {

    notFound: {
      description: 'Server with given ID not found in the system',
      responseType: 'notFound'
    },

  },

  fn: async function (inputs, exits) {

    sails.log.info(`Setting status of pingKicker to ${inputs.status} for server ${inputs.serverId}`, {serverId: inputs.serverId});

    await SdtdConfig.update({server: inputs.serverId}, {pingKickEnabled: inputs.status});

    if (inputs.status) {
      await sails.hooks.highpingkick.start(inputs.serverId);
    } else {
      await sails.hooks.highpingkick.stop(inputs.serverId);
    }

    return exits.success();

  }


};
