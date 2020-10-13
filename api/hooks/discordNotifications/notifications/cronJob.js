const DiscordNotification = require('../DiscordNotification');

class CronJob extends DiscordNotification {
  constructor() {
    super('cronjob');
  }

  async makeEmbed(event) {
    let client = sails.hooks.discordbot.getClient();
    let embed = new client.customEmbed();

    if (!event.job || !event.job.responses) {
      throw new Error('Implementation error! Must provide job info.');
    }

    let executionTime = new Date();

    embed.setTitle('Job ran!')
      .addField('Command', event.job.command, true)
      .addField('Execution time', ` ${executionTime.toDateString()} - ${executionTime.toTimeString()}`, true)
      .addBlankField();
    for (const response of event.job.responses) {
      const fieldName = [response.command, response.parameters].filter(Boolean).join(' ').substr(0, 255); // max length is 256
      embed.addField(
        fieldName || 'Response',
        response.result.length > 0 ? response.result : 'No response'
      );
    }

    return embed;
  }
}


module.exports = CronJob;
