const Commando = require('discord.js-commando');
const findSdtdServer = require('../../util/findSdtdServer.js');

class Player extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'player',
            group: 'sdtd',
            guildOnly: true,
            memberName: 'player',
            args: [{
                key: 'playername',
                prompt: 'Please specify a player name to look for',
                type: 'string'
            },
            {
                key: 'server',
                default: 1,
                type: 'integer',
                prompt: 'Please specify what server to run this commmand for!'
            }],
            examples: ["player Cata", "player bill"],
            description: 'Lookup a player profile',
        });
    }

    async run(msg, args) {
        let sdtdServers = await findSdtdServer(msg);

        if (sdtdServers.length === 0) {
            return msg.channel.send(`Could not find a server to execute this command for. You can link this guild to your server on the website.`);
        }

        let sdtdServer = sdtdServers[args.server - 1];

        if (!sdtdServer) {
            return msg.channel.send(`Did not find server ${args.server}! Check your config please.`)
        }


        let foundPlayer = await sails.models.player.find({
            server: sdtdServer.id,
            or: [
                {
                    name: {
                        'contains': args.playername
                    },
                },
                { entityId: isNaN(parseInt(args.playername)) ? -1 : args.playername },
                { steamId: args.playername },
            ]
        });

        if (foundPlayer.length == 0) {
            return msg.channel.send(`Did not find any players with that name/ID!`)
        }

        if (foundPlayer.length > 1) {
            return msg.channel.send(`Found ${foundPlayer.length} players! Narrow your search please. Consider using steam ID or entity ID instead of player name`);
        }

        let playerInfo = await sails.helpers.sdtd.loadPlayerData.with({ serverId: sdtdServer.id, steamId: foundPlayer[0].steamId });
        foundPlayer = playerInfo[0];
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
