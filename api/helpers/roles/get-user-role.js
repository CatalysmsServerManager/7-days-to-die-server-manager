module.exports = {


  friendlyName: 'Get User role',


  description: '',


  inputs: {

    userId: {
      required: true,
      type: 'number',
      custom: async (valueToCheck) => {
        let foundUser = await User.findOne(valueToCheck);
        return foundUser
      },
    },

    serverId: {
      required: true,
      type: 'number',
      custom: async (valueToCheck) => {
        let foundServer = await SdtdServer.findOne(valueToCheck);
        return foundServer
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

    let foundUser = await User.findOne(inputs.userId);

    let foundPlayer = await Player.findOne({
      where: {
        steamId: foundUser.steamId,
        server: inputs.serverId
      }
    });

    let foundRole;

    if (!_.isUndefined(foundPlayer)) {
      if (foundPlayer.role) {
        foundRole = await Role.findOne(foundPlayer.role);
      }
    }

    if (_.isUndefined(foundRole)) {
      return exits.success(undefined);
    }

    //sails.log.verbose(`Found role ${foundRole.name} for user ${foundUser.username}`)
    return exits.success(foundRole);

  }


};
