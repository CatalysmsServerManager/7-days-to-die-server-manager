const DiscordNotification = require('../DiscordNotification');

class Connected extends DiscordNotification {
  constructor() {
    super('connected');
  }

  async makeEmbed(event, embed) {
    embed.setTitle('Connected to CSMM')
      .setColor('GREEN');
    return embed;
  }
}


module.exports = Connected;
