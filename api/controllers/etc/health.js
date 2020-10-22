module.exports = {


  friendlyName: 'Health',


  description: '',


  inputs: {},


  exits: {

  },


  fn: async function (inputs, exits) {
    await sails.sendNativeQuery('SELECT 1');

    return exits.success();

  }


};
