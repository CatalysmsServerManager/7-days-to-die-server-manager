module.exports = {
  inputs: {
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

    const variables = await PersistentVariable.find({server: server.id});

    return exits.success({ variables });
  }
};
