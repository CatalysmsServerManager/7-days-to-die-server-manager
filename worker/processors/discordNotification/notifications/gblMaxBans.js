const DiscordNotification = require('../DiscordNotification');

class GblMaxBan extends DiscordNotification {
  constructor() {
    super('gblmaxban');
  }

  async makeEmbed(event, embed) {
    if (!event.player) {
      throw new Error('Implementation error! Must provide player info.');
    }

    if (event.banned) {
      embed
        .setTitle(
          `A player with ${event.bans.length} bans on the GBL was kicked`
        )
        .setColor('GREEN');
    } else {
      embed
        .setTitle(
          `A player with ${event.bans.length} bans on the GBL has connected`
        )
        .setColor('ORANGE');
    }

    embed
      .addField(
        'Steam ID',
        `[${event.player.steamId}](https://steamidfinder.com/lookup/${event.player.steamId}/)`,
        true
      )
      .addField('Name', event.player.name)
      .setFooter(`${event.server.name}`)
      .addField(
        `${event.bans.length} ban${event.bans.length === 1 ? '' : 's'} on the global ban list`,
        `[GBL profile page](${process.env.CSMM_HOSTNAME}/gbl/profile?steamId=${event.player.steamId})`
      )
      .setURL(`${process.env.CSMM_HOSTNAME}/player/${event.player.id}/profile`);

    return embed;
  }
}

module.exports = GblMaxBan;
