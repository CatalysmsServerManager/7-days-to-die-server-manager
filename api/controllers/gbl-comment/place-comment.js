module.exports = {


  friendlyName: 'Place comment',


  description: '',


  inputs: {

    banId: {
      type: 'number',
      required: true
    },

    comment: {
      type: 'string',
      required: true,
      maxLength: 10000000,
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

    let createdComment = await GblComment.create({
      content: inputs.comment,
      user: this.req.session.user.id,
      ban: inputs.banId
    }).fetch();

    createdComment.user = this.req.session.user;

    sails.log.info(`User #${this.req.session.user.id} ${this.req.session.user.username} has placed a comment on ban #${inputs.banId}`, createdComment)

    return exits.success(createdComment);

  }


};
