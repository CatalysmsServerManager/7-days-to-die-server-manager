module.exports = {


  friendlyName: 'set autoban status',


  description: 'Set the status of GBL autoban',


  inputs: {
    serverId: {
      required: true,
      type: 'string'
    },
    status: {
      required: true,
      type: 'boolean'
    }
  },


  exits: {

    notFound: {
      description: 'Server with given ID not found in the system',
      responseType: 'notFound'
    },

  },

  fn: async function (inputs, exits) {

    sails.log.info(`Setting status of GBL autoban to ${inputs.status} for server ${inputs.serverId}`);

    await SdtdConfig.update({server: inputs.serverId}, {gblAutoBanEnabled: inputs.status});

    return exits.success();

  }


};
