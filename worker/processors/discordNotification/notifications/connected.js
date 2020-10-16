const DiscordNotification = require('../DiscordNotification');

class Connected extends DiscordNotification {
  constructor() {
    super('connected');
  }

  async makeEmbed() {
    let embed = this.getBlankEmbed();

    embed.setTitle('Connected to CSMM')
      .setColor('GREEN');
    return embed;
  }
}


module.exports = Connected;
