class DiscordNotification {
  constructor(notificationType) {
    this.name = notificationType
    if (!this.name) {
        throw new Error('Must specify a name for this notification')
    }
  }

  async makeEmbed(event) {
    throw new Error(`makeEmbed has to be implemented.`)
  }

  async sendNotification(notificationOptions) {
    let enrichedOptions = await this.enrichEvent(notificationOptions);
    let embedToSend = await this.makeEmbed(enrichedOptions);
    embedToSend.setFooter(`CSMM notification for ${enrichedOptions.server.name}`)

    try {
        let discordClient = sails.hooks.discordbot.getClient();
        let discordChannel = await discordClient.channels.get(enrichedOptions.server.config.discordNotificationConfig[notificationOptions.notificationType]);
        if (discordChannel) {
            discordChannel.send(embedToSend);
        }
    } catch (error) {
        sails.log.error(`HOOK - discordNotification:DiscordNotification - ${error}`)
    }

  }

  async enrichEvent(notificationOptions) {
    if (!notificationOptions.serverId) {
        throw new Error(`Must specify a server ID to send notifications`)
    }
    let sdtdServer = await SdtdServer.findOne(notificationOptions.serverId).populate('config');
    sdtdServer.config = sdtdServer.config[0]

    notificationOptions.server = sdtdServer
    return notificationOptions
  }
}


module.exports = DiscordNotification
