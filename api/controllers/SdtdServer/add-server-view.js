module.exports = {

  friendlyName: 'Server addserver view',

  description: '',

  inputs: {
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'sdtdServer/addserver'
    },
    badRequest: {
      description: "User did a bad thing :D",
      responseType: "badRequest",
      statusCode: 400
    }
  },


  fn: async function (inputs, exits) {
    let user = await User.findOne(this.req.session.userId);
    if (!user) {
      return exits.badRequest("Please login again");
    }
    sails.log.info(`Serving add-server view to ${user.username}`)
    return exits.success();

  }
};
