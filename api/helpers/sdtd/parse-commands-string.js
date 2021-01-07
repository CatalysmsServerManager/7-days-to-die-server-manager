const split = require('split-string');

module.exports = {


  friendlyName: 'Parse commands string',


  description: 'Takes a string of commands separated with ; and returns an array of commands to execute',

  sync: true,

  inputs: {

    commands: {
      type: 'string',
      required: true
    },

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'boolean'
    },


  },



  fn: function (inputs, exits) {
    let result = split(inputs.commands, { separator: ';', quotes: ['"'] });
    result = result
      .map(x => x.trim())
      // Filters empty strings
      .filter(Boolean);
    return exits.success(result);

  }


};
