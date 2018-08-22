module.exports = {


  friendlyName: 'Check permission',


  description: '',


  inputs: {

    userId: {
      type: 'number'
    },

    serverId: {
      type: 'number'
    },

    playerId: {
      type: 'number'
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

    if ((_.isUndefined(inputs.userId) || _.isUndefined(inputs.serverId)) && _.isUndefined(inputs.playerId)) {
      return exits.invalidInput('You must provide either userId AND serverID or just a playerId');
    }

    let role;

    if (inputs.userId && inputs.serverId) {
      role = await sails.helpers.roles.getUserRole(inputs.userId, inputs.serverId);
    }

    if (inputs.playerId) {
      role = await sails.helpers.sdtd.getPlayerRole(inputs.playerId);
    }

    if (_.isUndefined(role)) {
      let foundRole = await Role.find({
        where: {
          server: player.server
        },
        sort: 'level DESC',
        limit: 1
      });
      role = foundRole[0]
    }

    let hasPermission = role[inputs.permission];

    if (role.manageServer) {
      hasPermission = true
    }

    sails.log.debug(`Checked if ${inputs.playerId ? `player ${inputs.playerId}` : `user ${inputs.userId}`} has permission ${inputs.permission} - ${hasPermission}`)

    // All done.
    return exits.success({
      hasPermission,
      role
    });

  }


};
