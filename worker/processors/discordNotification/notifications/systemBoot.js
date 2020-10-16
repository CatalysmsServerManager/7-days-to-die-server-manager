const DiscordNotification = require('../DiscordNotification');


class SystemBoot extends DiscordNotification {
  constructor() {
    super('systemboot');
  }

  async makeEmbed() {
    let embed = this.getBlankEmbed();

    embed.setTitle('CSMM has (re)started')
      .setColor('RANDOM');
    return embed;
  }
}


module.exports = SystemBoot;
