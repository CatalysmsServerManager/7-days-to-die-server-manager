const DiscordNotification = require('../DiscordNotification');


class SystemBoot extends DiscordNotification {
  constructor() {
    super('systemboot');
  }

  async makeEmbed(event, embed) {
    embed.setTitle('CSMM has (re)started')
      .setColor('RANDOM');
    return embed;
  }
}


module.exports = SystemBoot;
