const CustomFunction = require('./base');

class SendDiscord extends CustomFunction {
  constructor() { super('sendDiscord'); }

  async exec(server, args) {
    const channelId = args[0];
    const content = args[1];

    if (!/\d{18}/.test(channelId)) { throw new Error('Invalid channel ID'); }
    if (!content) { throw new Error('No content'); }

    const config = await SdtdConfig.findOne({ server: server.id });
    const discordClient = sails.helpers.discord.getClient();
    const serverGuild = config.discordGuildId;
    const guild = await discordClient.guilds.fetch(serverGuild);

    if (!guild) { throw new Error('You must have a Discord guild associated to this server'); }

    const channel = await guild.channels.cache.get(channelId.toString());
    if (!channel) { throw new Error(`Channel ${channelId} not found`); }

    await sails.helpers.discord.sendMessage(channelId, content);

    return `Sent message to channel ${channelId}`;
  }
}

module.exports = SendDiscord;
