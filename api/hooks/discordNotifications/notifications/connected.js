const DiscordNotification = require('../DiscordNotification')

class Connected extends DiscordNotification {
  constructor() {
    super("connected")
  }

  async makeEmbed(event){
    let client = sails.hooks.discordbot.getClient()
    let embed = new client.customEmbed()

    embed.setTitle('Connected to CSMM')
    .setColor("GREEN")
    return embed
  }
}


module.exports = Connected
