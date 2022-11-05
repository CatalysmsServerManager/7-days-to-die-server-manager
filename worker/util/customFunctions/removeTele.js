const CustomFunction = require('./base');

class RemoveTele extends CustomFunction {
  constructor() { super('RemoveTele'); }
  async exec(server, args) {
    const teleName = args[0];
    const playerId = args[1];

    if (!teleName) { throw new Error(`No teleport name provided`); }
    if (!playerId) { throw new Error(`No player arg provided`); }

    const orClauses = [];

    if (Number.isInteger(playerId)) {
      orClauses.push({ id: playerId, server: server.id });
    }

    orClauses.push({ steamId: playerId, server: server.id });
    orClauses.push({ name: playerId, server: server.id });
    orClauses.push({ crossId: playerId, server: server.id });


    const player = await Player.find({
      or: orClauses
    });

    if (!player.length) { throw new Error(`Player not found in database, searched for: ${playerId}`); }
    if (player[0].server !== server.id) { throw new Error(`Player not found, searched for: ${playerId}`); }

    const tele = await PlayerTeleport.find({
      name: teleName,
      player: player[0].id
    });

    if (!tele.length) {
      throw new Error(`Unknown teleport`);
    }

    await PlayerTeleport.destroy({ id: tele[0].id });

    return `Removed teleport ${teleName}`;

  }
}

module.exports = RemoveTele;
