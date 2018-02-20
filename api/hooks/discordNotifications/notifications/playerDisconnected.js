const DiscordNotification = require('../DiscordNotification')

class PlayerDisconnected extends DiscordNotification {
  constructor() {
    super("playerdisconnected")
  }

  async makeEmbed(event){
    let client = sails.hooks.discordbot.getClient()
    let embed = new client.customEmbed()

    embed.setTitle('Player disconnected')
    .setColor("RED")
    return embed
  }
}


module.exports = PlayerDisconnected
