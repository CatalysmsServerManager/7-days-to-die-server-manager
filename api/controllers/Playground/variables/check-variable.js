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
    name: {
      type: 'string',
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

    var isUnique = true;

    const variables = await PersistentVariable.find({server: server.id, name: inputs.name});

    variables.forEach((variable) => {
      if (variable.name === inputs.name && variable.id !== Number.parseInt(inputs.id)) {
        sails.log.warn(`${variable.id} - ${inputs.id}`);
        sails.log.warn(`${typeof variable.id} - ${typeof inputs.id}`);
        isUnique = false;
      }
    });

    return exits.success({ isUnique });
  }
};
