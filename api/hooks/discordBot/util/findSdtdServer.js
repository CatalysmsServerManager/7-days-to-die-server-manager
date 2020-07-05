async function findSdtdServer(discordMessage) {
  let discordGuild = discordMessage.guild;
  let foundServers = new Array();

  let serversWithGuild = await SdtdConfig.find({ discordGuildId: discordGuild.id });

  for (const serverConfig of serversWithGuild) {
    let server = await SdtdServer.findOne(serverConfig.server);
    foundServers.push(server);
  }

  return foundServers;
}

module.exports = findSdtdServer;
