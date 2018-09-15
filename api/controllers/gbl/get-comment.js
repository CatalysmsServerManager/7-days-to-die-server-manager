module.exports = {


  friendlyName: 'Get comment',


  description: '',


  inputs: {

    commentId: {
      type: 'number',
      required: true
    },

    banId: {
      type: 'number',
      required: true
    },

  },


  exits: {

    badRequest: {
      description: '',
      statusCode: 400
    },

    notAuthorized: {
      description: '',
      statusCode: 403
    }

  },


  fn: async function (inputs, exits) {

    let comments = new Array();

    if (inputs.banId) {
      comments = await GblComment.find({ban: inputs.banId})
    } else {
      comments = await GblComment.find({id: inputs.commentId})
    }

    return exits.success(comments);

  }


};
