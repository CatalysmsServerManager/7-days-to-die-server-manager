module.exports = {
  friendlyName: 'Set role from discord',
  description: 'Finds a player on discord and reloads his CSMM role info',
  inputs: {
    playerId: {
      required: true,
      type: 'number'
    },

  },
  exits: {},

  fn: async function (inputs, exits) {
    const player = await Player.findOne(inputs.playerId).populate('role');
    const currentPlayerRole = player.role;

    if (_.isUndefined(player)) {
      return exits.error(new Error('Unknown player ID'));
    }
    const user = await User.findOne({
      steamId: player.steamId
    });

    const serverConfig = await SdtdConfig.findOne({
      server: player.server
    }).populate('server');

    if (!user.discordId) {
      sails.log.debug('[setRoleFromDiscord] User has no discord ID linked, exiting', {player, user});
      return exits.success(player, undefined);
    }

    const { roles } = await sails.helpers.discord.discordrequest(`guilds/${serverConfig.discordGuildId}/members/${user.discordId}`);

    if (_.isNil(roles)) {
      return exits.success(player, undefined);
    }

    let highestRole = await Role.find({
      where: {
        discordRole: roles,
        server: player.server
      },
      sort: 'level ASC',
      limit: 1
    });


    if (_.isUndefined(highestRole[0])) {
      sails.log.warn(`[setRoleFromDiscord] No highest role found for server ${player.server}. If there are no Discord roles linked to CSMM roles, this is normal.`, {player, server: player.server});
      return exits.success(player, undefined);
    }

    if (shouldSetRole(currentPlayerRole, highestRole[0])) {
      await Player.update({
        id: player.id
      }, {
        role: highestRole[0].id
      });
      sails.log.debug(`[setRoleFromDiscord] Modified a players role - player ${player.id}. ${player.name} to role ${highestRole[0] ? highestRole[0].name : null}`, {player, server: player.server});
    }
    return exits.success(player, highestRole[0]);
  },
};


const shouldSetRole = (currentRole, potentialRole) => {
  if (_.isNil(currentRole) && _.isNil(potentialRole)) {
    return false;
  }
  if (_.isNil(potentialRole)) {
    return false;
  }

  if (_.isNil(currentRole)) {
    return true;
  }

  if (!_.isFinite(potentialRole.level)) {
    return false;
  }

  return currentRole.level > potentialRole.level;
};

module.exports.shouldSetRole = shouldSetRole;
