module.exports = {
  inputs: {
    serverId: {
      type: 'string',
      required: true,
    },
    id: {
      type: 'string',
      required: true,
    },
    lock: {
      type: 'boolean',
      required: true,
    },
  },


  exits: {},


  fn: async function (inputs, exits) {

    const server = await SdtdServer.findOne({ id: inputs.serverId });

    if (!server) {
      return this.res.status(400).json({
        message: 'Server not found',
      });
    }

    const variable = await PersistentVariable.updateOne({server: inputs.serverId, id: inputs.id}).set({preventDeletion: inputs.lock});

    const result = true;

    if (!variable) {
      result = false;
    }

    return exits.success({ result });
  }
};
