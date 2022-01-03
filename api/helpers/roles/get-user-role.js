module.exports = {


  friendlyName: 'Get User role',


  description: '',


  inputs: {

    userId: {
      required: true,
      type: 'number',
      custom: async function (valueToCheck) {
        let foundUser = await User.findOne(valueToCheck);
        return foundUser;
      },
    },

    serverId: {
      required: true,
      type: 'number',
      custom: async function (valueToCheck) {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer;
      },
    },

  },


  exits: {
    success: {
      outputFriendlyName: 'Success',
      outputType: 'json'
    },

  },

  fn: async function (inputs, exits) {

    const foundUser = await User.findOne(inputs.userId);
    const server = await SdtdServer.findOne(inputs.serverId);
    const foundPlayer = await Player.findOne({
      where: {
        steamId: foundUser.steamId,
        server: inputs.serverId
      }
    });
    let foundRole;

    if (foundUser.id === server.owner) {
      // Highest possible role
      foundRole = (await Role.find({
        where: {
          server: server.id
        },
        sort: 'level ASC',
        limit: 1
      }))[0];
    }

    if (!_.isUndefined(foundPlayer)) {
      if (foundPlayer.role) {
        foundRole = await Role.findOne(foundPlayer.role);
      }
    }

    if (_.isUndefined(foundRole)) {
      foundRole = await sails.helpers.roles.getDefaultRole(inputs.serverId);
    }

    return exits.success(foundRole);

  }


};
