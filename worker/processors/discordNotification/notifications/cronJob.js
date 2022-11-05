const DiscordNotification = require('../DiscordNotification');

class CronJob extends DiscordNotification {
  constructor() {
    super('cronjob');
  }

  async makeEmbed(event, embed) {
    if (!event.job || !event.job.responses) {
      throw new Error('Implementation error! Must provide job info.');
    }

    let executionTime = new Date();

    embed.setTitle('Job ran!')

      .addFields([{
        name: 'Command', value: event.job.command, inline: true
      }, {
        name: 'Execution time', value: executionTime.toUTCString(), inline: true
      }])

      .addFields(...event.job.responses.map(response => {
        const fieldName = [response.command, response.parameters].filter(Boolean).join(' ').slice(0, 200) || 'Response'; // max length is 256
        return {
          name: fieldName,
          value: response.result.length > 0 ? response.result : 'No response'
        };
      }));

    return embed;
  }
}


module.exports = CronJob;
