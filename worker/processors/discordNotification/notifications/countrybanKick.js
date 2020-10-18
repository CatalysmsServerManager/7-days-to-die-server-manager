const DiscordNotification = require('../DiscordNotification');

class CountrybanKick extends DiscordNotification {
  constructor() {
    super('countrybanKick');
  }

  async makeEmbed(event, embed) {
    embed.setTitle(`:flag_${event.player.country.toLowerCase()}: Country ban kicked: ${event.player.playerName}`)
      .setColor('ORANGE')
      .addField('Steam ID', `[${event.player.steamId}](https://steamidfinder.com/lookup/${event.player.steamId}/)`, true)
      .addField('Entity ID', `${event.player.entityId}`, true)
      .setFooter(`${event.server.name}`)
      .setURL(`${process.env.CSMM_HOSTNAME}/player/${event.player.id}/profile`);

    return embed;
  }
}

module.exports = CountrybanKick;
