const Commando = require('discord.js-commando');
const findSdtdServer = require('../../util/findSdtdServer.js');

class Toptime extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'toptime',
      aliases: ['toptime', 'time', 'timeplayed'],
      group: 'sdtd',
      memberName: 'toptime',
      description: '',
      details: "Show which players have the most playtime on the server",
      args: [{
          key: 'amountOfPlayers',
          prompt: 'Please specify how many players you want listed',
          min: 3,
          max: 20,
          default: 10,
          type: 'integer'
      }]
    });
  }

  async run(msg, args) {
    let sdtdServer = await findSdtdServer(msg);

    if (!sdtdServer) {
      return msg.channel.send(`Could not determine what server to work with! Make sure your settings are correct.`)
    }
    
    let serverInfo = await sails.helpers.loadSdtdserverInfo(sdtdServer.id);
    let playerInfo = await sails.helpers.loadPlayerData(sdtdServer.id);
    let embed = new this.client.customEmbed();

    playerInfo.players.sort((a,b) => {
        return b.totalPlaytime - a.totalPlaytime
    })

    let amountOfPlayersToShow = args.amountOfPlayers > playerInfo.players.length ? playerInfo.players.length : args.amountOfPlayers;

    for (let index = 0; index <= amountOfPlayersToShow-1; index++) {
        let player = playerInfo.players[index]
        embed.addField(`${index+1} - ${player.name}`, `${player.playtimeHHMMSS}`, true)
    }

    embed.setTitle(`${sdtdServer.name} - Top ${amountOfPlayersToShow} players by playtime`)

    msg.channel.send(embed)

  }

}


module.exports = Toptime;
