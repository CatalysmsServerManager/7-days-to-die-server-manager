module.exports = {

  friendlyName: 'Get servers with permissions',

  description: 'Find servers for which this user has some permissions',

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


  fn: async function (inputs, exits) {
    try {
      let foundUser = await User.findOne({
        id: inputs.userId
      });

      let players = await Player.find({
        steamId: foundUser.steamId
      }).populate('role').populate('server');

      let objectToSend = new Array();

      players.map(player => {
        try {
          player.server.role = player.role;
          objectToSend.push(player.server);
        } catch (error) {
          sails.log.error(error)
        }
      })

      let ownedServers = await SdtdServer.find({
        owner: inputs.userId
      });

      ownedServers.map(async server => {
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
          objectToSend.push(server)
        }
      });
      
      sails.log.debug(`API - User:getServersWithPermissions - Found ${objectToSend.length} servers for user ${inputs.userId}`);
      return exits.success(objectToSend);

    } catch (error) {
      sails.log.error(`API - User:getServersWithPermissions - ${error}`);
      return exits.error(error);
    }

  }
};
