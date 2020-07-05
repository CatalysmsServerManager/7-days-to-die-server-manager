class DiscordNotification {
  constructor(notificationType) {
    this.name = notificationType;
    if (!this.name) {
      throw new Error('Must specify a name for this notification');
    }
  }

  async makeEmbed() {
    throw new Error(`makeEmbed has to be implemented.`);
  }

  async getDiscordChannel(channel) {
    let discordClient = sails.hooks.discordbot.getClient();
    return discordClient.channels.get(channel);
  }

  async sendNotification(notificationOptions) {
    let enrichedOptions = await this.enrichEvent(notificationOptions);
    let embedToSend = await this.makeEmbed(enrichedOptions);
    if (!embedToSend) { return; }
    embedToSend.setFooter(`CSMM notification for ${enrichedOptions.server.name}`);

    try {
      const discordChannel = await this.getDiscordChannel(enrichedOptions.server.config.discordNotificationConfig[notificationOptions.notificationType]);
      if (discordChannel) {
        discordChannel.send(embedToSend);
      }
    } catch (error) {
      sails.log.error(`HOOK - discordNotification:DiscordNotification - ${error}`);
    }

  }

  async enrichEvent(notificationOptions) {
    if (!notificationOptions.serverId) {
      throw new Error(`Must specify a server ID to send notifications`);
    }
    let sdtdServer = await SdtdServer.findOne(notificationOptions.serverId).populate('config');
    sdtdServer.config = sdtdServer.config[0];

    notificationOptions.server = sdtdServer;
    return notificationOptions;
  }
}


module.exports = DiscordNotification;
