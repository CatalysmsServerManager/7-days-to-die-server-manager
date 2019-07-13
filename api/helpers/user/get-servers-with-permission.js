module.exports = {


  friendlyName: 'Get servers with permission',


  description: 'Gets servers that a user has permission to view on CSMM',


  inputs: {
    userId: {
      type: 'string',
      required: true,
    }
  },


  exits: {},

  fn: async function (inputs, exits) {
    const foundUser = await User.findOne({
      id: inputs.userId
    });

    const players = await Player.find({
      steamId: foundUser.steamId
    }).populate('role').populate('server');

    const objectToSend = [];

    players.map(player => {
      try {

        let ownerCheck;

        if (player.server.owner === inputs.userId) {
          ownerCheck = true;
        }

        if (player.role.manageServer || player.role.manageEconomy || player.role.managePlayers || player.role.manage.Roles || player.role.manage || player.role.viewDashboard || player.role.useTracking || player.role.viewAnalytics || player.role.manageTickets || user.steamId === sails.config.custom.adminSteamId || ownerCheck) {
          player.server.role = player.role;
          objectToSend.push(player.server);
        }

      } catch (error) {
        sails.log.error(error)
      }
    });

    sails.log.debug(`API - User:getServersWithPermissions - Found ${objectToSend.length} servers for user ${inputs.userId}`);
    return exits.success(objectToSend);
  }


};
