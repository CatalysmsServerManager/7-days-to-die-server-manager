const Commando = require('discord.js-commando');
const findSdtdServer = require('../../util/findSdtdServer.js');
const he = require('he');

class Status extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'status',
      aliases: ['d7', '7day', 'day7'],
      group: 'sdtd',
      guildOnly: true,
      memberName: 'status',
      description: 'Shows some basic info about a server',
      args: [{
        key: 'server',
        default: 1,
        type: 'integer',
        prompt: 'Please specify what server to run this commmand for!'
      }]
    });
  }

  async run(msg, args) {
    try {
      let sdtdServers = await findSdtdServer(msg);

      if (sdtdServers.length === 0) {
        return msg.channel.send(`Could not find a server to execute this command for. You can link this guild to your server on the website.`);
      }

      let sdtdServer = sdtdServers[args.server - 1];

      if (!sdtdServer) {
        return msg.channel.send(`Did not find server ${args.server}! Check your config please.`);
      }

      let serverInfo = await sails.helpers.loadSdtdserverInfo(sdtdServer.id);
      let playerInfo = await sails.helpers.sdtd.loadPlayerData.with({ serverId: sdtdServer.id, onlyOnline: true });
      let fps;

      try {
        fps = await sails.helpers.sdtd.loadFps(sdtdServer.id);
      } catch (error) {
        fps = 'Cannot load FPS =(';
      }

      if (!serverInfo.stats || !serverInfo.serverInfo) {
        return msg.channel.send(`Could not load required data. Is the server offline?`);
      }

      let onlinePlayersStringList = new String();

      playerInfo.forEach(player => {
        onlinePlayersStringList += `${he.decode(player.name)}, `;
      });

      let bloodMoonDay;
      let nextHorde;

      try {
        bloodMoonDay = await sails.helpers.sdtdApi.executeConsoleCommand(
          SdtdServer.getAPIConfig(sdtdServer),
          `ggs BloodMoonDay`
        );
        nextHorde = parseInt(bloodMoonDay.result.split(` = `)[1], 10);
      } catch (error) {
        sails.log.warn(`Hook - discordBot:status - ${error}`, { server: sdtdServer });
        sails.log.error(error, { server: sdtdServer });
      }
      const daysUntilHorde = nextHorde - serverInfo.stats.gametime.days;

      let embed = new this.client.customEmbed();

      embed.setTitle(`${serverInfo.name} - status`)
        .addField('FPS', `${fps}`, true)
        .addField(`Gametime`, `${serverInfo.stats.gametime.days} days ${serverInfo.stats.gametime.hours} hours ${serverInfo.stats.gametime.minutes} minutes
        Next horde in ${bloodMoonDay ? daysUntilHorde : `unknown`} days`, true)
        .addField(`${serverInfo.stats.hostiles} hostiles`, `${serverInfo.stats.animals} animals`)
        .addField(`${serverInfo.stats.players} players online`, onlinePlayersStringList.length > 0 ? onlinePlayersStringList : 'None');


      if (fps > 15) {
        embed.setColor('GREEN');
      }

      if (5 < fps && fps < 15) {
        embed.setColor('ORANGE');
      }

      if (fps < 5) {
        embed.setColor('RED');
      }

      msg.channel.send(embed);
    } catch (error) {
      const errorEmbed = new client.errorEmbed(`:octagonal_sign: Error while executing command`);
      return msg.channel.send(errorEmbed);
    }
  }
}


module.exports = Status;
