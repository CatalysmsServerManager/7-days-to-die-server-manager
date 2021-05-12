const CustomFunction = require('./base');

class SetRole extends CustomFunction {
  constructor() { super('setRole'); }

  async exec(server, args) {
    const playerId = args[0];
    const roleName = args[1];

    let player = await Player.find({
      or: [
        { id: playerId },
        { steamId: playerId, server: server.id },
        { name: playerId, server: server.id }
      ]
    });

    player = player[0];

    if (!player) { throw new Error(`Unknown player`); }


    const role = await Role.findOne({
      where: {
        server: server.id,
        name: roleName
      }
    });


    if (!role) { throw new Error(`Unknown role`); }


    await Player.update({ id: player.id }, { role: role.id });
    return `Set player ${player.steamId} to role ${role.name}`;
  }
}

module.exports = SetRole;
