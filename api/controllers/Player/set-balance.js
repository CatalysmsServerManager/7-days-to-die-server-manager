module.exports = {


  friendlyName: 'Set balance',


  description: '',


  inputs: {

    playerId: {
      type: 'string',
      required: true
    },

    newBalance: {
      type: 'number',
      required: true,
      min: 0,
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    await Player.update({id: inputs.playerId}, {currency: inputs.newBalance});
    return exits.success();

  }


};
