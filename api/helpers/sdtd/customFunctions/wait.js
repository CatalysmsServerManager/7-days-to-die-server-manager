module.exports = {


  friendlyName: 'Wait',


  description: 'Delays execution for a certain amount of seconds',

  inputs: {

    seconds: {
      type: 'number',
      required: true,
      min: 0
    },


  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'boolean'
    },


  },



  fn: async function (inputs, exits) {
    setTimeout(() => {
      return exits.success();
    }, inputs.seconds * 1000);
  }


};
