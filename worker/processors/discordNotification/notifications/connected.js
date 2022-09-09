const DiscordNotification = require('../DiscordNotification');

class Connected extends DiscordNotification {
  constructor() {
    super('connected');
  }

  async makeEmbed(event, embed) {
    embed.setTitle('Connected to CSMM')
      .setColor([0, 255, 0]);
    return embed;
  }
}


module.exports = Connected;
