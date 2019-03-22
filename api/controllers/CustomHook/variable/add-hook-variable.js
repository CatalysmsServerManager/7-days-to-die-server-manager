module.exports = {


  friendlyName: 'Add variable',


  description: 'Create custom hook variable.',


  inputs: {

    hookId: {
      type: 'string',
      required: true,
    },

    regex: {
      type: 'string',
      required: true
    },

    name: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 25
    },


  },


  exits: {
    badInput: {
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs, exits) {

    let result = await HookVariable.create({
      hook: inputs.hookId,
      name: inputs.name,
      regex: inputs.regex,
    }).fetch();
    return exits.success(result);

  }


};
