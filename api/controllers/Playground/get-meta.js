const CSMMCommand = require('../../../worker/util/CSMMCommand');

module.exports = {
  inputs: {  },
  exits: {},


  fn: async function (inputs, exits) {
    return exits.success({ helpers: CSMMCommand.getHelpers() });
  }
};
