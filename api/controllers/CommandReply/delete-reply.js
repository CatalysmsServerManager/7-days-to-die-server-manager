module.exports = {
  friendlyName: 'Delete reply',
  description: '',

  inputs: {
    replyId: {
      type: 'string',
      required: true
    },

  },


  exits: {

    badRequest: {
      description: '',
      statusCode: 400
    },

  },


  fn: async function (inputs, exits) {

    await CommandReply.destroy({
      id: inputs.replyId,
    });

    return exits.success();

  }


};
