const DiscordNotification = require('../DiscordNotification');

class SystemBoot extends DiscordNotification {
  constructor() {
    super('systemboot');
  }

  async makeEmbed() {
    let client = sails.hooks.discordbot.getClient();
    let embed = new client.customEmbed();

    embed.setTitle('CSMM has (re)started')
      .setColor('RANDOM');
    return embed;
  }
}


module.exports = SystemBoot;
