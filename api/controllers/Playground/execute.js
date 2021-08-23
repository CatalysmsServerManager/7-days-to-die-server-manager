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

  },


  exits: {},


  fn: async function (inputs, exits) {
    const command = new CSMMCommand(inputs.server, inputs.template, inputs.data);

    command.data = inputs.data;

    const {template, errors} =  await command.render();
    return exits.success({ output: template, errors });
  }
};
