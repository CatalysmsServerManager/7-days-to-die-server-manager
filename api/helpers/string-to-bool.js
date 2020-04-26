module.exports = {

  friendlyName: 'stringToBool',
  description: 'converts a string into a tristate bool.',
  sync: true,
  inputs: {
    value: {
      type: 'string',
      example: 'true',
      description: 'String to convert',
      required: false
    }
  },
  fn: function (inputs, exits) {
    const val = inputs.value;
    if (val === undefined || val === null) {
      return exits.success(null);
    }
    if (val.toLowerCase() === 'false') {
      return exits.success(false);
    }
    if (val.toLowerCase() === 'true') {
      return exits.success(true);
    }
    return exits.success(null);
  }
};
