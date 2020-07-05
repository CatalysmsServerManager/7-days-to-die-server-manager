module.exports = {

  friendlyName: 'Set discord chat channel',

  description: 'Set the chatChannelId for a SdtdServer',

  inputs: {
    serverId: {
      required: true,
      type: 'string'
    },
    blockedPrefixes: {
      required: true,
      type: 'json'
    },
  },

  exits: {
    success: {},
    badInput: {
      responseType: 'badRequest'
    },

  },


  fn: async function (inputs, exits) {

    try {

      let server = await SdtdServer.findOne(inputs.serverId);

      if (_.isUndefined(server)) {
        return exits.badInput('Unknown server ID');
      }

      inputs.blockedPrefixes = inputs.blockedPrefixes.split(',');

      await SdtdConfig.update({ server: server.id }, { chatChannelBlockedPrefixes: inputs.blockedPrefixes });
      sails.log.info(`Configured chat bridge blocked prefixes for ${server.name} - ${inputs.blockedPrefixes}`);
      return exits.success();

    } catch (error) {
      return exits.error(error);
    }

  }
};
