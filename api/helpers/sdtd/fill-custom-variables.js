module.exports = {


  friendlyName: 'Fill custom variables',

  description: '',

  inputs: {

    command: {
      type: 'string',
      required: true
    },

    data: {
      type: 'ref',
      required: true
    }

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'boolean'
    },


  },



  fn: async function (inputs, exits) {
    return exits.success(inputs.command.toString().replace(/\$\{([^}]+)\}/g, function(match, group1, offset, wholeString) {
      return _.get(inputs.data, group1, match);
    }));
  }

};
