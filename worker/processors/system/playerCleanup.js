module.exports = async function playerCleanup() {
  const enabledServers = await SdtdConfig.find({ where: { playerCleanupLastOnline: { '!=': null } } });
  const now = new Date();
  for (const config of enabledServers) {
    // Fail safe to prevent we drop player from a different server
    // Should never happen but y'know...
    if (!config.server) { continue; };

    const deleteFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate() - config.playerCleanupLastOnline);

    // Sometimes, servers report a lastOnline date at 1970-01-01T00:00:00.000Z or 0000-00-00T00:00:00.000Z.
    // We don't want to delete those as it's probably a bug in the server.
    const deleteTo = new Date(2000, 0, 1);

    const deletedPlayers = await Player.destroy({
      where:
      {
        server: config.server,
        lastOnline: {
          '<=': deleteFrom.toISOString(),
          '>=': deleteTo.toISOString()
        }
      }
    }).fetch();
    sails.log.warn(`Deleted ${deletedPlayers.length} players from server ${config.server}`, { deletedPlayers: deletedPlayers.map(p => _.omit(p, 'inventory')) });
  }
};
