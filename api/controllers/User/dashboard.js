module.exports = {

  friendlyName: 'Get user dashboard',

  description: 'Serves user dashboard view',

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
      viewTemplatePath: 'user/userDashboard'
    },
    notFound: {
      description: 'No user with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },

  /**
   * @memberof User
   * @name dashboard
   * @description Serves user dashboard view
   * @param {number} userId
   */

  fn: async function (inputs, exits) {

    const objectToSend = await sails.helpers.user.getServersWithPermission(inputs.userId)

    return exits.success({
      ownedServers: objectToSend
    })

  }
};
