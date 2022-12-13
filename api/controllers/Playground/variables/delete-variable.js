module.exports = {
  inputs: {
    variableId: {
      type: 'string',
      required: true,
    },

  },


  exits: {},


  fn: async function (inputs, exits) {
    const variable = await PersistentVariable.findOne({id: inputs.variableId});

    if (variable && variable.preventDeletion){
      throw new Error('variable must be unlocked before it can be deleted');
    }

    await PersistentVariable.destroyOne({id: inputs.variableId});
    return exits.success();
  }
};
