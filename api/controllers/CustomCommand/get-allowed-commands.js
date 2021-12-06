module.exports = {

  friendlyName: 'Get allowed commands',

  description: '',

  inputs: {
    serverId: {
      type: 'number',
      required: true
    },
  },

  exits: {
    success: {},

  },


  fn: async function (inputs, exits) {

    try {
      let server = await SdtdServer.findOne(inputs.serverId);
      let allowedCommands = await sails.helpers.sdtdApi.getAllowedCommands(SdtdServer.getAPIConfig(server));

      return exits.success(allowedCommands);

    } catch (error) {
      sails.log.error(`${error}`, {serverId: inputs.serverId});
      return exits.error(error);
    }


  }
};
