const Commando = require('discord.js-commando');
const findSdtdServer = require('../../util/findSdtdServer.js');

class Status extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'status',
      aliases: ['d7', '7day', 'day7'],
      group: 'sdtd',
      guildOnly: true,
      memberName: 'status',
      description: '',
      details: "Show server status",
    });
  }

  async run(msg, args) {
    let sdtdServer = await findSdtdServer(msg);

    if (!sdtdServer) {
      return msg.channel.send(`Could not determine what server to work with! Make sure your settings are correct.`)
    }

    let serverInfo = await sails.helpers.loadSdtdserverInfo(sdtdServer.id);
    let playerInfo = await sails.helpers.sdtd.loadPlayerData.with({ serverId: sdtdServer.id, onlyOnline: true });
    let fps = await sails.helpers.sdtd.loadFps(sdtdServer.id);

    let onlinePlayersStringList = new String();

    playerInfo.forEach(player => {
      onlinePlayersStringList += `${player.name}, `
    });


    let nextHorde = (Math.trunc(serverInfo.stats.gametime.days / 7) + 1) * 7
    const daysUntilHorde = nextHorde - serverInfo.stats.gametime.days;


    let embed = new this.client.customEmbed()

    embed.setTitle(`${serverInfo.name} - status`)
      .addField('FPS', `${fps}`, true)
      .addField(`Gametime`, `${serverInfo.stats.gametime.days} days ${serverInfo.stats.gametime.hours} hours ${serverInfo.stats.gametime.minutes} minutes
Next horde in ${daysUntilHorde} days`, true)
      .addField(`${serverInfo.stats.hostiles} hostiles`, `${serverInfo.stats.animals} animals`)
      .addField(`${serverInfo.stats.players} players online`, onlinePlayersStringList.length > 0 ? onlinePlayersStringList : "None")


    if (fps > 15) {
      embed.setColor('GREEN')
    }

    if (5 < fps && fps < 15) {
      embed.setColor('ORANGE')
    }

    if (fps < 5) {
      embed.setColor('RED')
    }

    msg.channel.send(embed)
  }

}


module.exports = Status;
