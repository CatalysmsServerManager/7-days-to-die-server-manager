module.exports = {


  friendlyName: 'set ping kicker checks to fail',


  description: '',


  inputs: {
    serverId: {
      required: true,
      type: 'string'
    },
    checksToFail: {
      required: true,
      type: 'number',
    }
  },


  exits: {

    notFound: {
      description: 'Server with given ID not found in the system',
      responseType: 'notFound'
    },

  },

  fn: async function (inputs, exits) {

    sails.log.info(`Setting checks to fail of pingKicker to ${inputs.checksToFail} for server ${inputs.serverId}`);

    await SdtdConfig.update({server: inputs.serverId}, {pingChecksToFail: inputs.checksToFail});

    return exits.success();

  }


};
