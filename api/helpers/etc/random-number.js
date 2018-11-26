module.exports = {


  friendlyName: 'Random number',


  description: 'Returns a random number between min (inclusive) and max (exclusive).',


  inputs: {
    min: {
      type: 'number',
      required: true
    },

    max: {
      type: 'number',
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    return exits.success(Math.round(Math.random() * (inputs.max - inputs.min) + inputs.min));
  }
};
