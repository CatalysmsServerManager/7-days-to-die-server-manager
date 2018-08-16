async function handleRoleUpdate(oldMember, newMember) {
  let oldRoles = oldMember.roles.array();
  let newRoles = newMember.roles.array();

  let deletedRole = _.difference(oldRoles, newRoles);
  let addedRole = _.difference(newRoles, oldRoles);

  if (deletedRole.length > 0) {
    sails.log.debug(`Detected a discord role was deleted ${newMember.user.tag}`, deletedRole[0].name);
    await deleteCSMMRole(newMember, deletedRole[0]);
  }

  if (addedRole.length > 0) {
    sails.log.debug(`Detected a discord role was added ${newMember.user.tag}`, addedRole[0].name);
    await addCSMMRole(newMember)
  }
}

async function deleteCSMMRole(member, role) {
  let serverConfigs = await SdtdConfig.find({
    discordGuildId: member.guild.id
  }).populate('server');

  let users = await User.find({
    discordId: member.id
  });

  let players = await Player.find({
    user: users.map(user => user.id),
    server: serverConfigs.map(config => config.server.id)
  }).populate('role');

  for (const player of players) {
    let currentPlayerRole = player.role;

    let linkedRole = await Role.find({
      discordRole: role.id,
      server: player.server
    });

    if (!_.isNull(currentPlayerRole)) {
      if (currentPlayerRole.id === linkedRole[0].id) {
        await Player.update({
          id: player.id
        }, {
          role: null
        })
      }
    }
    addCSMMRole(member);
  }
}

async function addCSMMRole(member) {

  let serverConfigs = await SdtdConfig.find({
    discordGuildId: member.guild.id
  }).populate('server');

  let users = await User.find({
    discordId: member.id
  });

  let players = await Player.find({
    user: users.map(user => user.id),
    server: serverConfigs.map(config => config.server.id)
  }).populate('role');

  for (const player of players) {

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

    if (_.isUndefined(highestRole[0])) {
        return
    }

    if ((!_.isNull(currentPlayerRole) ? currentPlayerRole.level : 9999999) >  highestRole[0].level) {
      await Player.update({
        id: player.id
      }, {
        role: highestRole[0] ? highestRole[0].id : null
      })
      sails.log.debug(`Modified a players role based on discord role change - player ${player.id}. ${player.name} to role ${highestRole[0] ? highestRole[0].name : null}`)
    }


  }
}


module.exports = handleRoleUpdate
