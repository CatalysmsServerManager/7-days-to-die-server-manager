async function findSdtdServer(interaction, idx = 0) {
  let discordGuildId = interaction.guildId;
  let foundServers = new Array();

  let serversWithGuild = await SdtdConfig.find({ discordGuildId });

  for (const serverConfig of serversWithGuild) {
    let server = await SdtdServer.findOne(serverConfig.server);
    foundServers.push(server);
  }

  if (idx === 'all') {
    return foundServers;
  }

  if (!foundServers[idx]) {
    return null;
  }

  return foundServers[idx];
}

module.exports = findSdtdServer;
