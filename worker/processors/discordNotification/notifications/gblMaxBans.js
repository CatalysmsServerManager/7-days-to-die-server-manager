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
        .setColor([0, 255, 0]);
    } else {
      embed
        .setTitle(
          `A player with ${event.bans.length} bans on the GBL has connected`
        )
        .setColor([255, 255, 0]);
    }

    embed
      .addFields([
        {
          name: 'Steam ID',
          value: `[${event.player.steamId}](https://steamidfinder.com/lookup/${event.player.steamId}/)`,
          inline: true
        }, {
          name: 'Name',
          value: event.player.name,
        }, {
          name: `${event.bans.length} ban${event.bans.length === 1 ? '' : 's'} on the global ban list`,
          value: `[GBL profile page](${process.env.CSMM_HOSTNAME}/gbl/profile?steamId=${event.player.steamId})`
        }
      ])
      .setFooter({ text: `${event.server.name}` })
      .setURL(`${process.env.CSMM_HOSTNAME}/player/${event.player.id}/profile`);

    return embed;
  }
}

module.exports = GblMaxBan;
