module.exports = {


  friendlyName: 'Delete variable',


  description: '',


  inputs: {

    variableId: {
      type: 'string',
      required: true,
    },

  },


  exits: {
    badInput: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs, exits) {

    let result = await HookVariable.destroy({
      id: inputs.variableId,
    }).fetch();
    return exits.success(result);

  }


};
