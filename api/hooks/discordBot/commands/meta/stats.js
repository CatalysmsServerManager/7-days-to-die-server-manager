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

    const logRequestTimes = await sails.helpers.redis.lrange('logRequestTimes');
    const logHandleTimes = await sails.helpers.redis.lrange('logHandleTimes');

    embed.setTitle(`CSMM stats`)
    .addField('Website', `${process.env.CSMM_HOSTNAME}`)
      .addField(`7DTD Servers`, statsInfo.servers, true)
      .addField(`7DTD Players`, statsInfo.players, true)
      .addField(`Discord guilds: ${statsInfo.guilds}`, `Users: ${statsInfo.users}`)
      .addField(`Uptime`, statsInfo.uptime, true)
      .addField(`Memory usage`, `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`, true)
      .addField('Average log request time min/avg/median/max', `${Math.min(...logRequestTimes)}/${average(logRequestTimes)}/${median(logRequestTimes)}/${Math.max(...logRequestTimes)}`)
      .addField('Average log handling time min/avg/median/max', `${Math.min(...logHandleTimes)}/${average(logHandleTimes)}/${median(logHandleTimes)}/${Math.max(...logHandleTimes)}`)
.setColor('RANDOM')

    msg.channel.send(embed)

  }

}

function median(values){
  if(values.length ===0) return 0;

  const mid = Math.floor(values.length / 2),
    nums = [...values].sort((a, b) => a - b);
  return values.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

function average(values) {
  if(values.length === 0) return 0;

  let sum = 0;

  values.forEach(n => {
    sum += parseInt(n, 10);
  });

  console.log(sum);

  return Math.round(sum / values.length)
}

module.exports = Stats;
