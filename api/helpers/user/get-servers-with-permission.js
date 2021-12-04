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

    let objectToSend = [];

    players.map(player => {
      try {

        let ownerCheck;

        if (player.server.owner === inputs.userId) {
          ownerCheck = true;
        }
        if (player.role) {
          if (player.role.manageServer || player.role.manageEconomy || player.role.managePlayers || player.role.manageGbl || player.role.viewDashboard || player.role.useTracking || player.role.viewAnalytics || player.role.manageTickets || ownerCheck) {
            player.server.role = player.role;
            objectToSend.push(player.server);
          }
        }
      } catch (error) {
        sails.log.error(error, {userId: inputs.userId});
      }
    });

    let ownedServers = await SdtdServer.find({
      owner: inputs.userId
    });

    for (const server of ownedServers) {
      let highestRole = await Role.find({
        where: {
          server: server.id
        },
        sort: 'level ASC',
        limit: 1
      });
      if (highestRole.length > 0) {
        highestRole = highestRole[0];
        server.role = highestRole;
        objectToSend.push(server);
      }
    }

    objectToSend = _.uniqBy(objectToSend, 'id');

    sails.log.debug(`API - User:getServersWithPermissions - Found ${objectToSend.length} servers for user ${inputs.userId}`, {userId: inputs.userId});
    return exits.success(objectToSend);
  }


};
