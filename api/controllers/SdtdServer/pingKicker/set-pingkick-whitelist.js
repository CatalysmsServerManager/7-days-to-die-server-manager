module.exports = {


  friendlyName: 'set ping kicker whitelist',


  description: '',


  inputs: {
    serverId: {
      required: true,
      type: 'string'
    },
    whitelist: {
      required: true,
      type: 'json',
    }
  },


  exits: {

    notAnArray: {
      description: 'Given whitelist is not a valid array',
      responseType: 'badRequest'
    },

  },

  fn: async function (inputs, exits) {

    if (!_.isArray(inputs.whitelist)) {
      return exits.notAnArray();
    }

    await SdtdConfig.update({
      server: inputs.serverId
    }, {
        pingWhitelist: JSON.stringify(inputs.whitelist)
    });

    sails.log.info(`Setting whitelist of pingKicker to ${inputs.whitelist} for server ${inputs.serverId}`);
    return exits.success();

  }


};
