const DiscordNotification = require('../DiscordNotification');

class CountrybanKick extends DiscordNotification {
  constructor() {
    super('countrybanKick');
  }

  async makeEmbed(event, embed) {
    embed.setTitle(`:flag_${event.player.country.toLowerCase()}: Country ban kicked: ${event.player.playerName}`)
      .setColor([255, 255, 0])

      .addFields([{
        name: 'Steam ID', value: `[${event.player.steamId}](https://steamidfinder.com/lookup/${event.player.steamId}/)`, inline: true
      }, {
        name: 'Entity ID', value: event.player.entityId, inline: true
      }])
      .setFooter({ text: `${event.server.name}` })
      .setURL(`${process.env.CSMM_HOSTNAME}/player/${event.player.id}/profile`);

    return embed;
  }
}

module.exports = CountrybanKick;
