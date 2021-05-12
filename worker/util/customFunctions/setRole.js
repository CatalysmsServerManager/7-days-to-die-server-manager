const CustomFunction = require('./base');

class SetRole extends CustomFunction {
  constructor(server) { super(server); }

  async exec(args) {
    const playerId = args[0];
    const roleName = args[1];

    let player = await Player.find({
      or: [
        { id: playerId },
        { steamId: playerId, server: this.server.id },
        { name: playerId, server: this.server.id }
      ]
    });

    player = player[0];

    if (!player) { throw new Error(`Unknown player`); }


    const role = await Role.findOne({
      where: {
        server: this.server.id,
        name: roleName
      }
    });


    if (!role) { throw new Error(`Unknown role`); }


    return Player.update({ id: player.id }, { role: role.id });
  }
}

module.exports = SetRole;
