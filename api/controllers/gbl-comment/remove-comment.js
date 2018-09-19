module.exports = {


  friendlyName: 'Remove comment',


  description: '',


  inputs: {

    commentId: {
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

    if (_.isUndefined(this.req.session.user)) {
      return exits.badRequest();
    }

    let foundComment = await GblComment.findOne(inputs.commentId);

    if (foundComment.user !== this.req.session.user.id) {
      return exits.notAuthorized();
    }

    let deletedComment = await GblComment.update({
      id: inputs.commentId
    }, {
      deleted: true
    }).fetch();

    sails.log.info(`User #${this.req.session.user.id} ${this.req.session.username} has deleted a comment on ban #${inputs.banId}`, deletedComment)

    return exits.success(deletedComment);

  }


};
