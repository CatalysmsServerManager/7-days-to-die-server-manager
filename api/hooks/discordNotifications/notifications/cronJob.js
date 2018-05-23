const DiscordNotification = require('../DiscordNotification')

class CronJob extends DiscordNotification {
    constructor() {
        super("cronjob")
    }

    async makeEmbed(event) {
        let client = sails.hooks.discordbot.getClient()
        let embed = new client.customEmbed()

        if (!event.job || !event.job.response || event.job.response.length === 0) {
            throw new Error('Implementation error! Must provide job info.')
        }

        embed.setTitle('Job ran!')
        .addField('Command', event.job.command, true)
        .addField('Execution time', Date.now(), true)
        .addField('Response', event.job.response.length > 0 ? event.job.response : "None")


        return embed
    }
}


module.exports = CronJob
