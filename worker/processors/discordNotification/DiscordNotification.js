const { CustomEmbed } = require('../../../api/hooks/discordBot/util/createEmbed');


class DiscordNotification {
  constructor(notificationType) {
    this.name = notificationType;
    if (!this.name) {
      throw new Error('Must specify a name for this notification');
    }
  }

  getBlankEmbed() {
    return new CustomEmbed();
  }

  async makeEmbed() {
    throw new Error(`makeEmbed has to be implemented.`);
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
      const channelId = enrichedOptions.server.config.discordNotificationConfig[notificationOptions.notificationType];
      await sails.helpers.discord.sendMessage(channelId, undefined, embedToSend);

    } catch (error) {
      try {
        const owner = await User.findOne(enrichedOptions.server.owner);
        if (owner.discordId) {
          const discordUser = await this.getDiscordUser(owner.discordId);
          await discordUser.send(`There was an error sending a CSMM notification to your channel and thus the notification has been disabled: \`${error}\``);
        }
      } catch (error) {
        sails.log.error(`HOOK - discordNotification:DiscordNotification - Error letting owner know of discord issue - ${error}`);
      }
      sails.log.error(`HOOK - discordNotification:DiscordNotification - ${error}`);

      delete enrichedOptions.server.config.discordNotificationConfig[notificationOptions.notificationType];
      // TODO: uncomment this! Was annoying during dev :D
      // await SdtdConfig.update({ server: enrichedOptions.server.id }, { discordNotificationConfig: enrichedOptions.server.config.discordNotificationConfig });

      // Still throw, this fails the queue job which is good for traceability
      throw error;
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
