async function findSdtdServer(discordMessage) {
    let discordGuild = discordMessage.guild
    let discordChannel = discordMessage.channel
    let serverId = 0

    let serversWithGuild = await SdtdConfig.find({ discordGuildId: discordGuild.id });

    if (serversWithGuild.length === 1) {
        serverId = serversWithGuild[0].server
    }

    if (serversWithGuild.length > 1) {
        let serversWithChannel = await SdtdConfig.find({ discordCommandsChannelId: discordChannel.id });

        if (serversWithChannel.length === 1) {
            serverId = serversWithChannel[0].server
        }
    }

    let server = await SdtdServer.findOne(serverId);
    return server
}

module.exports = findSdtdServer