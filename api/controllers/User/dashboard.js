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

    try {
      let user = await User.findOne(inputs.userId).populate('servers').populate('adminOf');
      if (_.isUndefined(user)) {
        return exits.notFound()
      }
      let ownedServers = user.servers.concat(user.adminOf)
      let ownedServersWithInfo = new Array();

      for (const server of ownedServers) {
        let sdtdServerInfo = await sails.helpers.loadSdtdserverInfo(server.id);
        if (!_.isUndefined(sdtdServerInfo)) {
          ownedServersWithInfo.push(sdtdServerInfo)
        }
      }
      sails.log.info(`VIEW - User:dashboard - User ${user.username} is on dashboard, ${ownedServersWithInfo.length} servers`, ownedServersWithInfo.map(server => server.name));
      return exits.success({
        user: user,
        ownedServers: ownedServersWithInfo
      })
    } catch (error) {
      sails.log.warn(`VIEW - User:dashboard - ${error}`)
      return exits.error()
    }
  }
};
