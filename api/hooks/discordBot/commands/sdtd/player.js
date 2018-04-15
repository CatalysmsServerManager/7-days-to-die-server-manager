const Commando = require('discord.js-commando');
const findSdtdServer = require('../../util/findSdtdServer.js');

class Player extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'player',
      group: 'sdtd',
      guildOnly: true,
      memberName: 'player',
      description: 'Lookup a player profile',
      args: [{
          key: 'playername',
          prompt: 'Please specify a player name to look for',
          type: 'string'
      }]
    });
  }

  async run(msg, args) {
    let sdtdServer = await findSdtdServer(msg);

    if (!sdtdServer) {
      return msg.channel.send(`Could not determine what server to work with! Make sure your settings are correct.`)
    }
    let foundPlayer = await sails.models.player.find({
        name: {
            'contains' : args.playername
        },
        server: sdtdServer.id
    })

    if (foundPlayer.length == 0) {
        return msg.channel.send(`Did not find any players with that name!`)
    }

    if (foundPlayer.length > 1) {
        return msg.channel.send(`Found ${foundPlayer.length} players! Narrow your search please`);
    }

    let playerInfo = await sails.helpers.loadPlayerData.with({serverId: sdtdServer.id, steamId: foundPlayer.steamId});
    foundPlayer = foundPlayer[0]
    let lastOnlineDate = new Date(foundPlayer.lastOnline);
    let embed = new this.client.customEmbed()

    embed.setTitle(`${foundPlayer.name} - profile`)
    .addField('🚫 Banned', foundPlayer.banned ? '✔️' : '✖️', true)
    .addField('💰 Currency', foundPlayer.currency, true)
    .addField('⏲️ Last online', lastOnlineDate.toDateString(), true)
    .addField(`💀 Deaths`, foundPlayer.deaths, true)
    .addField(`☠️ Zombie kills`, foundPlayer.zombieKills, true)
    .addField(`🔪 Player kills`, foundPlayer.playerKills, true)
    .addField(`💯 Score`, foundPlayer.score, true)
    .addField(`🆙 Level`, foundPlayer.level, true)

    .setFooter(`CSMM - ${sdtdServer.name}`)

    if (foundPlayer.avatarUrl) {
        embed.setImage(foundPlayer.avatarUrl)
    }


    msg.channel.send(embed)
  }

}


module.exports = Player;
