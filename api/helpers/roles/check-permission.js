module.exports = {


  friendlyName: 'Check permission',


  description: '',


  inputs: {

    userId: {
      type: 'number'
    },

    serverId: {
      type: 'number',
      required: true
    },

    playerId: {
      type: 'number'
    },

    discordId: {
      type: 'string'
    },

    permission: {
      type: 'string',
      required: true
    },

  },


  exits: {

    invalidInput: {
      description: "Invalid input given to this helper."
    }

  },


  fn: async function (inputs, exits) {

    if ((_.isUndefined(inputs.userId) || _.isUndefined(inputs.serverId)) && (_.isUndefined(inputs.discordId) || _.isUndefined(inputs.serverId)) && _.isUndefined(inputs.playerId)) {
      return exits.invalidInput('You must provide either userId AND serverID, discordId AND serverId or just a playerId' + JSON.stringify(inputs));
    }

    let role;

    if (inputs.discordId) {
      let foundUser = await User.find({
        discordId: inputs.discordId
      });
      if (!_.isUndefined(foundUser[0])) {
        inputs.userId = foundUser[0].id
      }
    }


    if (inputs.userId && inputs.serverId) {
      role = await sails.helpers.roles.getUserRole(inputs.userId, inputs.serverId);
    }

    if (inputs.playerId) {
      role = await sails.helpers.sdtd.getPlayerRole(inputs.playerId);
    }

    // If we find no role for a player, we default to highest level role.
    if (_.isUndefined(role)) {
      let foundRole = await Role.find({
        where: {
          server: inputs.serverId
        },
        sort: 'level DESC',
        limit: 1
      });
      role = foundRole[0]
    }

    let hasPermission = false;

    if (!_.isUndefined(inputs.userId)) {
      let foundUser = await User.findOne(inputs.userId);
      if (foundUser.steamId === sails.config.custom.adminSteamId) {
        foundRole = await Role.find({
          where: {
            server: inputs.serverId
          },
          sort: 'level ASC',
          limit: 1
        })
        if (foundRole[0]) {
          role = foundRole[0];
        }
        hasPermission = true
      }
    }

    if (role[inputs.permission]) {
      hasPermission = true
    }

    if (role.manageServer) {
      hasPermission = true
    }

    if (!_.isUndefined(inputs.userId) && !hasPermission) {
      let server = await SdtdServer.findOne(inputs.serverId);

      if (server.owner === inputs.userId) {
        hasPermission = true;
      }
    }



    sails.log.debug(`Checked if ${inputs.playerId ? `player ${inputs.playerId}` : `user ${inputs.userId}`} has permission ${inputs.permission} - ${hasPermission}`)

    // All done.
    return exits.success({
      hasPermission,
      role
    });

  }


};
