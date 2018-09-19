module.exports = {


  friendlyName: 'Edit comment',


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

    let user = this.req.session.user;

    if (_.isUndefined(user)) {
      return exits.badRequest();
    }

    let foundComment = await GblComment.findOne(inputs.commentId).populate('heartedBy');

    let alreadyHearted = _.includes(foundComment.heartedBy.map(heartUser => heartUser.id), user.id);

    if (alreadyHearted) {
      await GblComment.removeFromCollection(foundComment.id, 'heartedBy').members(user.id);
    } else {
      await GblComment.addToCollection(foundComment.id, 'heartedBy').members(user.id);
    }

    sails.log.info(`User #${user.id} ${user.username} has toggled a heart to ${alreadyHearted ? 'off' : 'on'} for comment #${inputs.commentId}`);

    return exits.success(foundComment);


  }


};
