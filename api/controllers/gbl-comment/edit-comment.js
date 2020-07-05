module.exports = {


  friendlyName: 'Edit comment',


  description: '',


  inputs: {

    commentId: {
      type: 'number',
      required: true
    },

    comment: {
      type: 'string',
      required: true,
      maxLength: 100000,
      minLength: 10
    }

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

    let updatedComment = await GblComment.update({
      id: inputs.commentId
    }, {
      content: inputs.comment,
    }).fetch();

    sails.log.info(`User #${this.req.session.user.id} ${this.req.session.username} has edited a comment on ban #${inputs.banId}`, updatedComment);

    return exits.success(updatedComment);


  }


};
