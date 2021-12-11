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
      .setColor('RED')
      .addField(
        'Steam ID',
        `[${event.player.steamId}](https://steamidfinder.com/lookup/${event.player.steamId}/)`,
        true
      )
      .addField(
        'CSMM profile',
        `${process.env.CSMM_HOSTNAME}/player/${event.player.id}/profile`
      )
      .addField(
        `${gblBans.length} ban${gblBans.length === 1 ? '' : 's'
        } on the global ban list`,
        `[GBL profile page](${process.env.CSMM_HOSTNAME}/gbl/profile?steamId=${event.player.steamId})`
      )
      .addField('Role', event.player.role ? event.player.role.name : 'None')
      .setFooter(`${event.server.name}`)
      .setURL(`${process.env.CSMM_HOSTNAME}/player/${event.player.id}/profile`);

    if (event.player.avatarUrl) {
      embed.setThumbnail(event.player.avatarUrl);
    }

    return embed;
  }
}

module.exports = PlayerDisconnected;
