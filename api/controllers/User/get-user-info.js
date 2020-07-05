module.exports = {

  friendlyName: 'Get user info',

  description: 'Get users profile info',

  inputs: {
    userId: {
      description: 'The ID of the user to look up.',
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {},
    notFound: {
      description: 'No user with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },

  /**
   * @memberof User
   * @name get-user-info
   * @description gets servers this user is owner of
   * @param {number} userId
   */

  fn: async function (inputs, exits) {
    sails.log.debug(`API - User:get-user-info - Getting profile for user ${inputs.userId}`);

    try {
      let user = await User.findOne(inputs.userId);
      return exits.success(user);

    } catch (error) {
      sails.log.error(`API - SdtdServer:get-user-info - ${error}`);
      return exits.error(error);
    }

  }
};
