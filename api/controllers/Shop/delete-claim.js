module.exports = {


  friendlyName: 'Delete claimed item',


  description: '',


  inputs: {
    claimId: {
      type: 'number',
      required: true,
    },


  },


  exits: {
    success: {},

    invalidIds: {
      description: '',
      responseType: 'badRequest',
      statusCode: 400
    }
  },


  fn: async function (inputs, exits) {

    await PlayerClaimItem.destroy({id: inputs.claimId});

    return exits.success();

  }


};
