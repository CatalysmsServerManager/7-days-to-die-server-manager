const Commando = require('discord.js-commando');
const findSdtdServer = require('../../util/findSdtdServer.js');

class Top extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'top',
            group: 'sdtd',
            memberName: 'top',
            guildOnly: true,
            description: '',
            args: [{
                key: 'type',
                prompt: 'Please specify which top you want to see',
                type: 'string',
                oneOf: ['currency', 'zombies', 'players', 'deaths', 'playtime', 'score', 'level']
            }, {
                key: 'amount',
                prompt: 'Amount of players to show',
                type: 'integer',
                default: 10,
                max: 20,
                min: 3
            },
            {
                key: 'server',
                default: 1,
                type: 'integer',
                prompt: 'Please specify what server to run this commmand for!'
            }],
            details: "Show top 10 players in different categories",
            details: "The type argument can be: 'currency', 'zombies', 'players', 'deaths', 'playtime', 'score' or 'level'",
            examples: ["top playtime 5", "top currency 20", "top deaths"]
        });
    }

    async run(msg, args) {
        let sdtdServers = await findSdtdServer(msg);

        if (!sdtdServers.length === 0) {
            return msg.channel.send(`Could not find a server to execute this command for. You can link this guild to your server in the server settings.`);
        }

        let sdtdServer = sdtdServers[args.server - 1];

        if (!sdtdServer) {
          return msg.channel.send(`Did not find server ${args.server}! Check your config please.`)
        }

        let fieldToSearchFor = args.type

        switch (args.type) {
            case 'zombies':
                fieldToSearchFor = 'zombieKills'
                break;
            case 'players':
                fieldToSearchFor = 'playerKills'
                break;

            default:
                break;
        }

        let embed = new this.client.customEmbed();

        let players = await Player.find({
            where: { server: sdtdServer.id },
            limit: args.amount,
            sort: `${fieldToSearchFor} DESC`,
        })

        let positionIterator = 1;

        players.forEach(player => {
            embed.addField(`${positionIterator}. ${player.name}`, args.type === 'playtime' ? ` ${playtimeToDDHHMMSS(player.playtime)}` : ` ${player[fieldToSearchFor]}`, true);
            positionIterator++
        })

        embed.setTitle(`${sdtdServer.name} - Top ${args.amount} players by ${args.type}`)
            .setColor('RANDOM')

        msg.channel.send(embed)

    }

}


module.exports = Top;


function playtimeToDDHHMMSS(playtime) {
    let days = Math.floor(playtime / 86400);
    playtime %= 86400;
    let hours = Math.floor(playtime / 3600);
    playtime %= 3600;
    let minutes = Math.floor(playtime / 60);
    let seconds = playtime % 60;
    return `${days} D, ${hours} H, ${minutes} M, ${seconds} S`
}