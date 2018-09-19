module.exports = {


  friendlyName: 'Get comment',


  description: '',


  inputs: {

    commentId: {
      type: 'number',
    },

    banId: {
      type: 'number',
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
      comments = await GblComment.find({ban: inputs.banId}).populate('user');
    } else {
      comments = await GblComment.find({id: inputs.commentId}).populate('user');
    }

    return exits.success(comments);

  }


};
