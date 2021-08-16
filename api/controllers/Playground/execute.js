module.exports = {
  inputs: {

    template: {
      type: 'string',
      required: true,
    },


  },


  exits: {},


  fn: async function (inputs, exits) {
    return exits.success(inputs.template);

  }


};
