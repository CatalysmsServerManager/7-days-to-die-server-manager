const DiscordNotification = require('../DiscordNotification');

class SSEThrottled extends DiscordNotification {
  constructor() {
    super('sseThrottled');
  }

  async makeEmbed(event, embed) {
    if (event.type === 'throttled') {
      embed.setTitle(`Server throttled: logs rate limit exceeded`)
        .setColor('RED');
    } else {
      embed.setTitle(`Logs amount under rate limit, reconnecting`)
        .setColor('GREEN');
    }


    return embed;
  }
}

module.exports = SSEThrottled;
