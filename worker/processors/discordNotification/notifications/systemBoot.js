const DiscordNotification = require('../DiscordNotification');
const { CustomEmbed } = require('../../../../api/hooks/discordBot/util/createEmbed');


class SystemBoot extends DiscordNotification {
  constructor() {
    super('systemboot');
  }

  async makeEmbed() {
    let embed = new CustomEmbed();

    embed.setTitle('CSMM has (re)started')
      .setColor('RANDOM');
    return embed;
  }
}


module.exports = SystemBoot;
