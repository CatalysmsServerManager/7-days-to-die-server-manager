const DiscordNotification = require('../DiscordNotification')

class ConnectionLost extends DiscordNotification {
  constructor() {
    super("connectionlost")
  }

  async makeEmbed(event){
    let client = sails.hooks.discordbot.getClient()
    let embed = new client.customEmbed()
    embed.setTitle('Lost connection to CSMM')
    .addField('Reason', event.msg.output)
    .setColor("RED")
    return embed
  }
}


module.exports = ConnectionLost
