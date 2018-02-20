const DiscordNotification = require('../DiscordNotification')

class PlayerConnected extends DiscordNotification {
  constructor() {
    super("playerconnected")
  }

  async makeEmbed(event){
    let client = sails.hooks.discordbot.getClient()
    let embed = new client.customEmbed()

    embed.setTitle('Player connected')
    .setColor("GREEN")
    return embed
  }
}


module.exports = PlayerConnected
