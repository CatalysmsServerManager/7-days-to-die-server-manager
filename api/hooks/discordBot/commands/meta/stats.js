const Commando = require('discord.js-commando');

class Stats extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'stats',
      group: 'meta',
      aliases: ['info'],
      memberName: 'stats',
      description: 'Show system stats and info',
    });
  }

  async run(msg, args) {
    const statsInfo = await sails.helpers.meta.loadSystemStatsAndInfo();
    const memUsage = process.memoryUsage();
    const embed = new this.client.customEmbed();

    embed.setTitle(`CSMM stats`)
    .addField('Website', `${process.env.CSMM_HOSTNAME}`)
      .addField(`7DTD Servers`, statsInfo.servers, true)
      .addField(`7DTD Players`, statsInfo.players, true)
      .addField(`Discord guilds: ${statsInfo.guilds}`, `Users: ${statsInfo.users}`)
      .addField(`Uptime`, statsInfo.uptime, true)
      .addField(`Memory usage`, `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`, true)
.setColor('RANDOM')

    msg.channel.send(embed)

  }

}


module.exports = Stats;
