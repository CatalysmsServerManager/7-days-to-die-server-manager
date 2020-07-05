module.exports = {


  friendlyName: 'Is JSON',


  description: 'Test if a value is valid JSON or not',

  inputs: {
    jsonToTest: {
      type: 'ref',
      required: true,
    },

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'boolean'
    },


  },

  sync: true,


  fn: function (inputs, exits) {

    try {
      var obj = JSON.parse(inputs.jsonToTest);
      if (obj && typeof obj === 'object' && obj !== null) {
        return exits.success(true);
      }
    } catch (err) {}
    return exits.success(false);

  }


};
