module.exports = {


  friendlyName: 'Del',


  description: 'Delete redis value.',


  inputs: {

    keyString: {
      required: true,
      type: 'string'
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    sails.cache[inputs.keyString] = null;
    return exits.success();
  }
};
