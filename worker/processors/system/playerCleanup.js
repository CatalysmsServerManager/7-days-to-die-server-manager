
module.exports = async function playerCleanup() {
  const enabledServers = await SdtdConfig.find({ where: { playerCleanupLastOnline: { '!=': null } } });
  const now = new Date();
  for (const config of enabledServers) {
    // Fail safe to prevent we drop player from a different server
    // Should never happen buy y'know...
    if (!config.server) { continue; };

    const deleteFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate() - config.playerCleanupLastOnline);
    await Player.destroy({ where: { server: config.server, lastOnline: { '<=': deleteFrom.toISOString() } } });
  }
};
