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
      memberName: 'day7',
      description: 'Shows basic information about a server',
      details: "For more information see the website"
    });
  }

  async run(msg, args) {

    try {
      let sdtdServer = await SdtdServer.find({
        discordGuildId: msg.guild.id
      }).limit(1)
      return sails.helpers.loadSdtdserverInfo(sdtdServer[0].id).exec((err, serverInfo) => {
        if (err) {
          throw err
        }
        let resultEmbed = new msg.client.customEmbed();
        resultEmbed
        .setColor('GREEN')
        .addField('Online Players', serverInfo.stats.players, true)
        .addField('Ping', serverInfo.serverInfo.Ping, true)
        .addField('Hostiles / Animals', `${serverInfo.stats.hostiles} / ${serverInfo.stats.animals}`)
        .setFooter(serverInfo.serverInfo.GameHost)

        return msg.channel.send(resultEmbed)
      })
    } catch (error) {
      sails.log.error(error);
    }


  }
}


module.exports = Day7;
