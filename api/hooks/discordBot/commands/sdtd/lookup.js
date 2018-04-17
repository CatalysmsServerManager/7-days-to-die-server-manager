const Commando = require('discord.js-commando');
const findSdtdServer = require('../../util/findSdtdServer.js');
const fs = require('fs');
const checkIfAdmin = require('../../util/checkIfAdmin');

class Lookup extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'lookup',
      group: 'sdtd',
      guildOnly: true,
      memberName: 'lookup',
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

    let isAdmin = await checkIfAdmin(msg.author.id, sdtdServer.id);
    if (!isAdmin) {
        let errorEmbed = new client.errorEmbed(`You are not authorized to use \`${this.name}\`.`)
        return msg.reply(errorEmbed)
    }

    let foundPlayer = await sails.models.player.find({
        server: sdtdServer.id,
        name: {
            'contains' : args.playername
        },
    })

    if (foundPlayer.length == 0) {
        return msg.channel.send(`Did not find any players with that name!`)
    }

    if (foundPlayer.length > 1) {
        return msg.channel.send(`Found ${foundPlayer.length} players! Narrow your search please`);
    }

    let playerInfo = await sails.helpers.loadPlayerData.with({serverId: sdtdServer.id, steamId: foundPlayer.steamId});
    foundPlayer = await sails.models.player.findOne(foundPlayer[0].id);
    let lastOnlineDate = new Date(foundPlayer.lastOnline);
    let embed = new this.client.customEmbed()


    embed.setTitle(`${foundPlayer.name} - profile`)
    .addField('🚫 Banned', foundPlayer.banned ? '✔️' : '✖️', true)
    .addField('💰 Currency', foundPlayer.currency, true)
    .addField('⏲️ Last online', lastOnlineDate.toDateString(), true)
    .addField('🗺️ Location', `${foundPlayer.positionX} ${foundPlayer.positionY} ${foundPlayer.positionZ}`, true)
    .addField('🖧 IP', foundPlayer.ip, true)
    .addField('👤 Profile', `${process.env.CSMM_HOSTNAME}/player/${foundPlayer.id}/profile`)


    .setFooter(`CSMM - ${sdtdServer.name}`)

    if (foundPlayer.avatarUrl) {
        embed.setThumbnail(foundPlayer.avatarUrl)
    }

    if (foundPlayer.inventory) {
        fs.writeFile(`${sdtdServer.name}_${foundPlayer.id}_inventory.txt`, JSON.stringify(foundPlayer.inventory), err => {
            if (err) {
                sails.log.error(err)
            }
            msg.channel.send({
                embed: embed,
                files: [{
                    attachment: `${sdtdServer.name}_${foundPlayer.id}_inventory.txt`,
                    name: `${sdtdServer.name}_${foundPlayer.id}_inventory.txt`
                }]
            }).then(response => {
                fs.unlink(`${sdtdServer.name}_${foundPlayer.id}_inventory.txt`, err => {
                    if (err) {
                        sails.log.error(err)
                    }
                })
            }).catch(e => {
                sails.log.error(`DISCORD COMMAND - LOOKUP - ${e}`)
            })
        });
    } else {
        msg.channel.send(embed)
    }


  }

}


module.exports = Lookup;
