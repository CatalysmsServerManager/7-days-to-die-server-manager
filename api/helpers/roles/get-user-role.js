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
    let foundServer = await SdtdServer.findOne(inputs.serverId);

    let foundPlayer = await Player.findOne({
      where: {
        steamId: foundUser.steamId,
        server: foundServer.id
      }
    });

    try {
      if (!_.isUndefined(foundPlayer)) {
        await sails.helpers.discord.setRoleFromDiscord(foundPlayer.id);
      }
    } catch (error) {
      sails.log.debug(`Couldn't update players roles via discord - ${error}`)
    }

    let foundRole;


    let amountOfRoles = await Role.count({
      server: inputs.serverId
    });

    if (amountOfRoles === 0) {
      await Role.create({
        name: "Default role",
        level: 9999,
        server: inputs.serverId,
        amountOfteleports: 5
      });
    }

    if (foundUser.steamId === sails.config.custom.catalysmSteamId) {
      foundRole = await Role.find({
        where: {
          server: inputs.serverId
        },
        sort: 'level ASC',
        limit: 1
      })
      sails.log.warn(`Catalysm is accessing something... If you see this, you are catalysm and you're not on CSMM this means bad news bears.`)
    }
    foundRole = foundRole[0];

    if (!_.isUndefined(foundPlayer)) {
      if (foundPlayer.role) {
        foundRole = await Role.findOne(foundPlayer.role);
      } else {
        foundRole = await Role.find({
          where: {
            server: foundPlayer.server
          },
          sort: 'level DESC',
          limit: 1
        });
        foundRole = foundRole[0]
      }
    }

    sails.log.verbose(`Found role ${foundRole.name} for user ${foundUser.username}`)
    return exits.success(foundRole);

  }


};
