const DiscordNotification = require('../DiscordNotification');

class ConnectionLost extends DiscordNotification {
  constructor() {
    super('connectionlost');
  }

  async makeEmbed(event, embed) {
    embed.setTitle('Lost connection to CSMM')
      .setColor([255, 0, 0]);
    return embed;
  }
}


module.exports = ConnectionLost;
