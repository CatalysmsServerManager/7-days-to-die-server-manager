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

    let result = inputs.commands.split(';');
    result = result.map(x => x.trim());
    return exits.success(result);

  }


};
