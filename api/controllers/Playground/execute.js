const CSMMCommand = require('../../../worker/util/CSMMCommand');

module.exports = {
  inputs: {

    template: {
      type: 'string',
      required: true,
    },

    data: {
      type: 'json',
      required: true,
    },

    serverId: {
      type: 'string',
      required: true,
    },

  },


  exits: {},


  fn: async function (inputs, exits) {
    const server = await SdtdServer.findOne({id: inputs.serverId});

    if (!server) {
      return this.res.status(400).json({
        message: 'Server not found',
      });
    }

    if (inputs.data.server) {
      inputs.data.server = Object.assign(inputs.data.server, server);
    }

    const command = new CSMMCommand(server, inputs.template, inputs.data);

    const {template, errors} =  await command.render();
    return exits.success({ output: template, errors });
  }
};
