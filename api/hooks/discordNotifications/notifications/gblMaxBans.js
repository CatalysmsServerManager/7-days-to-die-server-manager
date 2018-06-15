const DiscordNotification = require('../DiscordNotification')

class GblMaxBan extends DiscordNotification {
    constructor() {
        super("gblmaxban")
    }

    async makeEmbed(event) {
        let client = sails.hooks.discordbot.getClient()
        let embed = new client.customEmbed()

        if (!event.player) {
            throw new Error('Implementation error! Must provide player info.')
        }

        let executionTime = new Date();

        embed.setTitle(`A player with ${event.bans.length} bans on the GBL has connected`)
        .setColor("RED")
        .addField('Steam ID', `[${event.player.steamId}](https://steamidfinder.com/lookup/${event.player.steamId}/)`, true)
        .setFooter(`${event.server.name}`)
        .setURL(`${process.env.CSMM_HOSTNAME}/player/${event.player.id}/profile`)


        return embed
    }
}


module.exports = GblMaxBan
