const DiscordNotification = require('../DiscordNotification');

class PlayerDisconnected extends DiscordNotification {
  constructor() {
    super('playerdisconnected');
  }

  async makeEmbed(event, embed) {
    if (!event.player) {
      return null;
    }
    let gblBans = await BanEntry.find({ steamId: event.player.steamId });

    embed
      .setTitle(`Disconnected: ${event.player.name}`)
      .setColor([255, 0, 0])

      .addFields([
        {
          name: 'Steam ID',
          value: `[${event.player.steamId}](https://steamidfinder.com/lookup/${event.player.steamId}/)`,
          inline: true
        }, {
          name: 'CSMM profile',
          value: `${process.env.CSMM_HOSTNAME}/player/${event.player.id}/profile`
        }, {
          name: `${gblBans.length} ban${gblBans.length === 1 ? '' : 's'} on the global ban list`,
          value: `[GBL profile page](${process.env.CSMM_HOSTNAME}/gbl/profile?steamId=${event.player.steamId})`
        }, {
          name: 'Role',
          value: event.player.role ? event.player.role.name : 'None'
        }
      ])
      .setFooter({ text: `${event.server.name}` })
      .setURL(`${process.env.CSMM_HOSTNAME}/player/${event.player.id}/profile`);

    if (event.player.avatarUrl) {
      embed.setThumbnail(event.player.avatarUrl);
    }

    return embed;
  }
}

module.exports = PlayerDisconnected;
