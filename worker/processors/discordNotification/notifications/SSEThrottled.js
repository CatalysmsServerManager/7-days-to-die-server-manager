const DiscordNotification = require('../DiscordNotification');

class SSEThrottled extends DiscordNotification {
  constructor() {
    super('sseThrottled');
  }

  async makeEmbed(event, embed) {
    if (event.type === 'throttled') {
      embed.setTitle(`Server throttled: logs rate limit exceeded`)
        .setColor([255, 0, 0]);
    } else {
      embed.setTitle(`Logs amount under rate limit, reconnecting`)
        .setColor([0, 255, 0]);
    }


    return embed;
  }
}

module.exports = SSEThrottled;
