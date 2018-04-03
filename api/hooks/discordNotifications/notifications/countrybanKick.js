const DiscordNotification = require('../DiscordNotification')

class CountrybanKick extends DiscordNotification {
  constructor() {
    super("countrybanKick")
  }

  async makeEmbed(event){
    let client = sails.hooks.discordbot.getClient()
    let embed = new client.customEmbed()

    embed.setTitle(`:flag_${event.player.country.toLowerCase()}: Country ban kicked: ${event.player.playerName}`)
    .setColor("ORANGE")
    .addField('Steam ID', `[${event.player.steamID}](https://steamidfinder.com/lookup/${event.player.steamID}/)`, true)
    .addfiel('Entity ID', `${event.player.entityID}`, true)
    .setFooter(`${event.server.name}`)
    .setURL(`${process.env.CSMM_HOSTNAME}/player/${event.player.id}/profile`)

    return embed
  }
}

module.exports = CountrybanKick
