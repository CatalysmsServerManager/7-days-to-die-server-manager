module.exports = {
  friendlyName: 'Set role from discord',
  description: 'Finds a player on discord and reloads his CSMM role info',
  inputs: {
    playerId: {
      required: true,
      type: 'number'
    },

  },
  exits: {
    error: {
      friendlyName: 'error'
    },
  },

  fn: async function (inputs, exits) {

    let player = await Player.findOne(inputs.playerId);

    if (_.isUndefined(player)) {
      return exits.error(new Error("Unknown player ID"));
    }

    let user = await User.findOne({
      steamId: player.steamId
    });

    let serverConfig = await SdtdConfig.findOne({
      server: player.server
    }).populate('server');

    let discordClient = sails.hooks.discordbot.getClient();
    let discordGuild = await discordClient.guilds.get(serverConfig.discordGuildId);

    if (_.isUndefined(discordGuild) || !discordGuild) {
      return exits.success(player, undefined);
    }

    if (!user.discordId) {
      return exits.success(player, undefined);
    }

    let member = await discordGuild.members.get(user.discordId);

    if (_.isUndefined(member)) {
      return exits.error(new Error("No GuildMember found corresponding to the user."));
    }

    let memberRoles = member.roles.array();

    let currentPlayerRole = player.role;

    let highestRole = await Role.find({
      where: {
        discordRole: memberRoles.map(role => role.id),
        server: player.server
      },
      sort: 'level ASC',
      limit: 1
    });


    if (!_.isUndefined(highestRole[0])) {
      if ((!_.isNull(currentPlayerRole) ? currentPlayerRole.level : 9999999) > highestRole[0].level) {
        await Player.update({
          id: player.id
        }, {
          role: highestRole[0] ? highestRole[0].id : null
        })
      }
      sails.log.debug(`Modified a players role - player ${player.id}. ${player.name} to role ${highestRole[0] ? highestRole[0].name : null}`);
    }

    return exits.success(player, highestRole[0]);
  },
};
