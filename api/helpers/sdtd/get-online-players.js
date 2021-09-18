module.exports = {


  friendlyName: 'Get online players',


  description: '',


  inputs: {

    serverId: {
      type: 'number',
      required: true,
      description: 'Id of the server',
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
    }
  },

  fn: async function (inputs, exits) {
    const server = await SdtdServer.findOne({ id: inputs.serverId });

    if (_.isUndefined(server)) {
      return exits.error(new Error('Invalid server'));
    }

    try {
      const onlinePlayers = await sails.helpers.sdtdApi.getOnlinePlayers(SdtdServer.getAPIConfig(server));
      return exits.success(onlinePlayers);
    } catch (e) {
      sails.log.warn(e, {serverId: inputs.serverId});
      return exits.success([]);
    }
  }
};



