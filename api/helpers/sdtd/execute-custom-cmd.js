const CSMMCommand = require('../../../worker/util/CSMMCommand');
c;

module.exports = {
  friendlyName: 'Execute custom command',
  description: 'Takes an array of commands and executes them for a server',

  inputs: {
    server: {
      type: 'ref',
      required: true
    },

    commands: {
      type: 'string',
      required: true
    },

    data: {
      type: 'ref'
    }
  },

  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'boolean'
    }
  },

  fn: async function (inputs, exits) {
    const command = new CSMMCommand(inputs.server, inputs.commands, inputs.data);

    await command.loadData();
    await command.render();
    const result = await command.execute();

    return exits.success(result);
  }
};

