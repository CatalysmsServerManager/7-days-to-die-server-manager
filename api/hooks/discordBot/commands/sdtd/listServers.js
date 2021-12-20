const Commando = require('discord.js-commando');
const findSdtdServer = require('../../util/findSdtdServer.js');

class ListServers extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'listservers',
      group: 'sdtd',
      memberName: 'listservers',
      guildOnly: true,
      description: '',
      details: 'Shows a list of servers configured to a guild'
    });
  }

  async run(msg) {
    try {
      let sdtdServers = await findSdtdServer(msg);

      if (!sdtdServers.length === 0) {
        return msg.channel.send(`Didn't find any server(s)! You can link this guild to your server on the website.`);
      }

      let embed = new this.client.customEmbed();

      embed.setTitle(`Server list`)
        .setColor('RANDOM');

      let iterator = 1;
      for (const server of sdtdServers) {
        const serverInfo = await sails.helpers.loadSdtdserverInfo(server.id);
        if (serverInfo.serverInfo) {
          embed.addField(`${iterator}. ${serverInfo.serverInfo.GameHost ? serverInfo.serverInfo.GameHost : serverInfo.name}`, `${serverInfo.serverInfo.ServerDescription ? serverInfo.serverInfo.ServerDescription : 'No description'}`);
        } else {
          embed.addField(`${iterator}. ${serverInfo.name}`, `${'🔴 Could not load server info.'}`);
        }
        iterator++;
      }
      msg.channel.send(embed);
    } catch (error) {
      const errorEmbed = new client.errorEmbed(`:octagonal_sign: Error while executing command`);
      return msg.channel.send(errorEmbed);
    }
  }
}


module.exports = ListServers;


