const Commando = require('discord.js-commando');

class Stats extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'stats',
      group: 'meta',
      aliases: ['info'],
      memberName: 'stats',
      description: '',
      details: "Show system stats",
    });
  }

  async run(msg, args) {

    let statsInfo = await sails.helpers.meta.loadSystemStatsAndInfo();

    let embed = new this.client.customEmbed()

    embed.setTitle(`CSMM stats`)
    .addField('Website', `${process.env.CSMM_HOSTNAME}`)
      .addField(`7DTD Servers`, statsInfo.servers, true)
      .addField(`7DTD Players`, statsInfo.players, true)
      .addField(`Discord guilds: ${statsInfo.guilds}`, `Users: ${statsInfo.users}`, true)
      .addField(`Uptime`, statsInfo.uptime, true)
      .addField('Modules', `Discord chat bridges: ${statsInfo.chatBridges}
Country ban modules: ${statsInfo.countryBans}
MOTD handlers: ${statsInfo.sdtdMotds}
Ingame command handlers: ${statsInfo.sdtdMotds}`)
.addField(`Players have teleported ${statsInfo.amountOfTimesTeleported} times`, `There are ${statsInfo.amountOfTeleports} teleport locations`)
.addField(`Players have executed ${statsInfo.amountOfCustomCommandsExecuted} custom commands`, `There are ${statsInfo.amountOfCustomCommands} custom commands registered`)
.addField(`Players' average wealth is ${statsInfo.currencyAvg}`,`${statsInfo.currencyTotal} units of currency in circulation`)


    msg.channel.send(embed)

  }

}


module.exports = Stats;
