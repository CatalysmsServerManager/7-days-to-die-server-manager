const split = require('split-string');
const Handlebars = require('handlebars');

Handlebars.registerHelper('eq', function (a, b) {
  return (a === b);
});
Handlebars.registerHelper('gt', function (a, b) {
  return (a > b);
});
Handlebars.registerHelper('gte', function (a, b) {
  return (a >= b);
});
Handlebars.registerHelper('lt', function (a, b) {
  return (a < b);
});
Handlebars.registerHelper('lte', function (a, b) {
  return (a <= b);
});
Handlebars.registerHelper('ne', function (a, b) {
  return (a !== b);
});


module.exports = {


  friendlyName: 'Parse commands string',


  description: 'Takes a string of commands separated with ; and returns an array of commands to execute',

  sync: true,

  inputs: {

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
    },


  },



  fn: function (inputs, exits) {

    let result;
    // TODO: create onlinePlayers datapoint
    try {
      const compiledTemplate = Handlebars.compile(inputs.commands);
      result = compiledTemplate(inputs.data);
    } catch (error) {
      sails.log.warn(`Invalid handlebars template! Falling back to "dumb parsing" - ${error.message}`);
      result = inputs.commands;
    }

    result = split(result, { separator: ';', quotes: ['"'] });
    result = result
      .map(x => x.trim())
      // Filters empty strings
      .filter(Boolean);
    return exits.success(result);

  }


};
