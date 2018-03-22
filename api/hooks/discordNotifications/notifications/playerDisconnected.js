const DiscordNotification = require('../DiscordNotification')

class PlayerDisconnected extends DiscordNotification {
  constructor() {
    super("playerdisconnected")
  }

  async makeEmbed(event){
    let client = sails.hooks.discordbot.getClient()
    let embed = new client.customEmbed()

    embed.setTitle(`Disconnected: ${event.player.name}`)
    .setColor("RED")
    .addField('Steam ID', `[${event.player.steamId}](https://steamidfinder.com/lookup/${event.player.steamId}/)`, true)
    .setFooter(`${event.server.name}`)
    .setURL(`${process.env.CSMM_HOSTNAME}/player/${event.player.id}/profile`)
    return embed
  }
}


module.exports = PlayerDisconnected
