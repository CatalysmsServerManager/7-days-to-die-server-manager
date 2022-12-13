module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    value: {
      type: 'string',
      required: true,
    },
    preventDeletion: {
      type: 'boolean',
      required: true,
    }
  },


  exits: {},


  fn: async function (inputs, exits) {
    await PersistentVariable.updateOne({id: inputs.id})
      .set({name: inputs.name, value: inputs.value, preventDeletion: inputs.preventDeletion});
    return exits.success();
  }
};
