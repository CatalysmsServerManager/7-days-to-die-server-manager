module.exports = {


  friendlyName: 'set ping kicker message',


  description: '',


  inputs: {
    serverId: {
      required: true,
      type: 'string'
    },
    message: {
      required: true,
      type: 'string',
    }
  },


  exits: {

    notFound: {
      description: 'Server with given ID not found in the system',
      responseType: 'notFound'
    },

  },

  fn: async function (inputs, exits) {

    sails.log.info(`Setting message of pingKicker to ${inputs.message} for server ${inputs.serverId}`);

    await SdtdConfig.update({server: inputs.serverId}, {pingKickMessage: inputs.message});

    return exits.success();

  }


};
