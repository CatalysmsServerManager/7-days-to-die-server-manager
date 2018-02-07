const Commando = require('discord.js-commando');

/**
 * @memberof module:DiscordCommands
 * @name Day7
 * @description Displays basic information about a 7 Days to Die server
 */

class Day7 extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'day7',
      group: '7dtd',
      aliases: ['status', 'd7'],
      memberName: 'day7',
      description: 'Shows basic information about a server',
      details: 'For more information see the website'
    });
  }

  async run(msg, args) {

    try {
      let sdtdServer = await SdtdServer.find({
        discordGuildId: msg.guild.id
      }).limit(1);

      let serverInfo = await sails.helpers.loadSdtdserverInfo(sdtdServer[0].id);
      let playerInfo = await sails.helpers.loadPlayerData(sdtdServer[0].id);
      let onlinePlayers = playerInfo.players.filter(player => {
        return player.online;
      });
      let onlinePlayerNames = new Array();
      onlinePlayers.forEach(player => {
        onlinePlayerNames.push(player.name);
      })
      if (onlinePlayerNames.length === 0) {
        onlinePlayerNames = `No players online`;
      }
      let resultEmbed = new msg.client.customEmbed();
      resultEmbed
        .setColor('GREEN')
        .addField('Game time', `${serverInfo.stats.gametime.days} day(s), ${serverInfo.stats.gametime.hours} hour(s), ${serverInfo.stats.gametime.minutes} minute(s)`)
        .addField(`Online Players: ${serverInfo.stats.players}`, onlinePlayerNames , true)
        .addField('Ping', serverInfo.serverInfo.Ping, true)
        .addField('Hostiles / Animals', `${serverInfo.stats.hostiles} / ${serverInfo.stats.animals}`)
        .setFooter(serverInfo.name);

      return msg.channel.send(resultEmbed);
    } catch (error) {
      sails.log.error(`HOOK DiscordBot:day7 - ${error}`);
      return msg.reply(`An error occurred while running the command: ${error}`)
    }


  }
}


module.exports = Day7;
