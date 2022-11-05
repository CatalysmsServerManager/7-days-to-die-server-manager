module.exports = async function playerCleanup() {
  const enabledServers = await SdtdConfig.find({ where: { playerCleanupLastOnline: { '!=': null } } });
  const now = new Date();
  for (const config of enabledServers) {
    // Fail safe to prevent we drop player from a different server
    // Should never happen but y'know...
    if (!config.server) { continue; };

    const deleteFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate() - config.playerCleanupLastOnline);
    const deletedPlayers = await Player.destroy({ where: { server: config.server, lastOnline: { '<=': deleteFrom.toISOString() } } }).fetch();
    sails.log.warn(`Deleted ${deletedPlayers.length} players from server ${config.server}`, { deletedPlayers: deletedPlayers.map(p => _.omit(p, 'inventory')) });
  }
};
