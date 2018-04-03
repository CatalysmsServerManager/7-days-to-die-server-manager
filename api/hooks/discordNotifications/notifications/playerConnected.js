const DiscordNotification = require('../DiscordNotification')

class PlayerConnected extends DiscordNotification {
  constructor() {
    super("playerconnected")
  }

  async makeEmbed(event){
    let client = sails.hooks.discordbot.getClient()
    let embed = new client.customEmbed()

    embed.setTitle(`Connected: ${event.player.name}`)
    .setColor("GREEN")
    .addField('Steam ID', `[${event.player.steamId}](https://steamidfinder.com/lookup/${event.player.steamId}/)`, true)
    .setFooter(`${event.server.name}`)
    .setURL(`${process.env.CSMM_HOSTNAME}/player/${event.player.id}/profile`)

    return embed
  }
}

module.exports = PlayerConnected
