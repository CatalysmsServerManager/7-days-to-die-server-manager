module.exports = {
  inputs: {
    variableId: {
      type: 'string',
      required: true,
    },

  },


  exits: {},


  fn: async function (inputs, exits) {
    await PersistentVariable.destroyOne({id: inputs.variableId});
    return exits.success();
  }
};
