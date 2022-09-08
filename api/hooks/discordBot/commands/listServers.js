const { SlashCommandBuilder } = require('discord.js');
const findSdtdServer = require('../util/findSdtdServer.js');

const ListServers = {
  name: 'list-servers',
  slashCommand: new SlashCommandBuilder()
    .setName('list-servers')
    .setDescription('Shows a list of servers configured to a guild'),

  handler: async (interaction, client) => {

    const sdtdServers = await findSdtdServer(interaction, 'all');

    const embed = new client.customEmbed();

    embed.setTitle(`Server list`);

    embed.addFields(sdtdServers.map((server, idx) => {
      return {
        name: (idx + 1).toString(),
        value: server.name
      };
    }));

    return interaction.reply({ embeds: [embed] });
  }
};



module.exports = ListServers;
