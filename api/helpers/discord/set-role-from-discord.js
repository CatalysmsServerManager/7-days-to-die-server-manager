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
    const player = await Player.findOne(inputs.playerId);
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
      sails.log.debug('[setRoleFromDiscord] User has no discord ID linked, exiting');
      return exits.success(player, undefined);
    }

    const { roles } = await sails.helpers.discord.discordrequest(`guilds/${serverConfig.discordGuildId}/members/${user.discordId}`);

    let highestRole = await Role.find({
      where: {
        discordRole: roles,
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
        });
      }
      sails.log.debug(`[setRoleFromDiscord] Modified a players role - player ${player.id}. ${player.name} to role ${highestRole[0] ? highestRole[0].name : null}`);
      return exits.success(player, highestRole[0]);
    }

    return exits.error(new Error(`Unexpected to return here, should have returned earlier.`));

  },
};
