module.exports = {

  friendlyName: 'Get owned servers',

  description: 'Get basic server info about servers the given user owns',

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
      description: 'No player with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },

  /**
   * @memberof User
   * @name getOwnedServers
   * @description gets servers this user is owner of
   * @param {number} userId 
   */

  fn: async function (inputs, exits) {
    sails.log.debug(`API - User:getOwnedServers - Getting servers for user ${inputs.userId}`);

    try {
        let user = await User.findOne(inputs.userId).populate('servers')
        console.log(user)
        return exits.success(user.servers)

    } catch (error) {
      sails.log.error(`API - SdtdServer:sendMessage - ${error}`);
      return exits.error(error)
    }

  }
};
