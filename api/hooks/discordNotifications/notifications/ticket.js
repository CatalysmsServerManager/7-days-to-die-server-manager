const DiscordNotification = require('../DiscordNotification')

class Ticket extends DiscordNotification {
  constructor() {
    super("ticket")
  }

  async makeEmbed(event){
    let client = sails.hooks.discordbot.getClient()
    let embed = new client.customEmbed()

    if (!event.ticketNotificationType) {
        throw new Error('Implementation error! Must provide a ticketNotificationType.')
    }

    if (!event.ticket) {
        throw new Error('Implementation error! Must provide a ticket info.')
    }

    embed.setTitle('Ticket notification')
    .addField('Type', event.ticketNotificationType, true)
    .addField('Link', `${process.env.CSMM_HOSTNAME}/sdtdticket/${event.ticket.id}`)
    .setColor("GREEN")
    return embed
  }
}


module.exports = Ticket
