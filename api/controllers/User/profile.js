module.exports = {

  friendlyName: 'Get user profile',

  description: 'Serves user profile view',

  inputs: {
    userId: {
      description: 'The ID of the user to look up.',
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'user/profile'
    },
    notFound: {
      description: 'No user with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },

  /**
   * @memberof User
   * @name profile
   * @description Serves user profile view
   * @param {number} userId
   */

  fn: async function (inputs, exits) {
    sails.log.debug(`API - User:profile - Getting profile for user ${inputs.userId}`);

    try {
      let user = await User.findOne(inputs.userId);
      let servers = await SdtdServer.find({
        owner: inputs.userId
      });
      let players = await Player.find({
        steamId: user.steamId
      }).populate('server').populate('role');

      return exits.success({
        user: user,
        servers: servers,
        players: players
      });

    } catch (error) {
      sails.log.error(`API - SdtdServer:profile - ${error}`);
      return exits.error(error);
    }

  }
};
