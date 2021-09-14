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
  },


  fn: async function (inputs, exits) {
    const user = await User.findOne(this.req.session.userId);
    sails.log.info(`Serving add-server view to ${user.username}`, {user});
    return exits.success();

  }
};
