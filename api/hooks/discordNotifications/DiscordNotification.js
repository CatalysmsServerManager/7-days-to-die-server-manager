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

  async getDiscordChannel(channelId) {
    let discordClient = sails.hooks.discordbot.getClient();
    return discordClient.channels.get(channelId);
  }

  async getDiscordUser(userId) {
    let discordClient = sails.hooks.discordbot.getClient();
    return discordClient.fetchUser(userId, false);
  }

  async sendNotification(notificationOptions) {
    let enrichedOptions = await this.enrichEvent(notificationOptions);
    let embedToSend = await this.makeEmbed(enrichedOptions);
    if (!embedToSend) { return; }
    embedToSend.setFooter(`CSMM notification for ${enrichedOptions.server.name}`);

    try {
      const discordChannel = await this.getDiscordChannel(enrichedOptions.server.config.discordNotificationConfig[notificationOptions.notificationType]);
      if (discordChannel) {
        await discordChannel.send(embedToSend);
      }
    } catch (error) {
      try {
        const owner = await User.findOne(enrichedOptions.server.owner);
        if (owner.discordId) {
          const discordUser = await this.getDiscordUser(owner.discordId);
          discordUser.send(`There was an error sending a CSMM notification to your channel: ${error}`);
        }
      } catch (error) {
        sails.log.error(`HOOK - discordNotification:DiscordNotification - Error letting owner know of discord issue - ${error}`);
      }
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
