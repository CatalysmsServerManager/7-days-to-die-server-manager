const DiscordNotification = require('../DiscordNotification')

class CronJob extends DiscordNotification {
    constructor() {
        super("cronjob")
    }

    async makeEmbed(event) {
        let client = sails.hooks.discordbot.getClient()
        let embed = new client.customEmbed()

        if (!event.job || !event.job.response) {
            throw new Error('Implementation error! Must provide job info.')
        }

        let executionTime = new Date();

        embed.setTitle('Job ran!')
        .addField('Command', event.job.command, true)
        .addField('Execution time', ` ${executionTime.toDateString()} - ${executionTime.toTimeString()}`, true)
        .addField('Response', event.job.response.result.length > 0 ? event.job.response.result : "None")


        return embed
    }
}


module.exports = CronJob
