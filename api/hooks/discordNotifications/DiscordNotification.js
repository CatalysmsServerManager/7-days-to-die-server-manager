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

  async sendNotification(notificationEvent, notificationOptions) {

    let enrichedEvent = await this.enrichEvent(notificationEvent, notificationOptions.serverId);
    let embedToSend = await this.makeEmbed(enrichedEvent);

    try {
        let discordClient = sails.hooks.discordbot.getClient();
        let discordChannel = await discordClient.channels.get(enrichedEvent.server.config.notificationChannelId);
        if (discordChannel) {
            discordChannel.send(embedToSend);
        }
    } catch (error) {
        sails.log.error(`HOOK - discordNotification:DiscordNotification - ${error}`)
    }

  }

  async enrichEvent(notificationEvent, serverId) {
    if (!serverId) {
        throw new Error(`Must specify a server ID to send notifications`)
    }
    let sdtdServer = await SdtdServer.findOne(serverId).populate('config');
    sdtdServer.config = sdtdServer.config[0]

    notificationEvent.server = sdtdServer
    return notificationEvent
  }
}


module.exports = DiscordNotification
