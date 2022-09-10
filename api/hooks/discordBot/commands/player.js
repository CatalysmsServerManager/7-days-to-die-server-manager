const { SlashCommandBuilder } = require('discord.js');
const findSdtdServer = require('../util/findSdtdServer.js');
const getInteractionOption = require('../util/getInteractionOption.js');

const Player = {
  name: 'player',
  slashCommand: new SlashCommandBuilder()
    .setName('player')
    .setDescription('Find a player profile')
    .addStringOption(option =>
      option.setName('player')
        .setDescription('Player to search for')
        .setRequired(true)
    ).addIntegerOption(option =>
      option.setName('server')
        .setDescription('Which server to run this command against')
    ),

  handler: async (interaction, client) => {
    const serverIdx = getInteractionOption(interaction, 'server', 1) - 1;
    const player = getInteractionOption(interaction, 'player');

    const sdtdServer = await findSdtdServer(interaction, serverIdx);

    if (!sdtdServer) {
      return interaction.editReply(`Did not find server ${serverIdx}! Check your config please.`);
    }

    let foundPlayer = await sails.models.player.find({
      server: sdtdServer.id,
      or: [
        {
          name: {
            'contains': player
          },
        },
        { entityId: isNaN(parseInt(player)) ? -1 : player },
        { steamId: player },
      ]
    });

    if (foundPlayer.length === 0) {
      return interaction.editReply(`Did not find any players with that name/ID!`);
    }

    if (foundPlayer.length > 1) {
      return interaction.editReply(`Found ${foundPlayer.length} players! Narrow your search please. Consider using steam ID or entity ID instead of player name`);
    }

    let playerInfo = await sails.helpers.sdtd.loadPlayerData.with({ serverId: sdtdServer.id, steamId: foundPlayer[0].steamId });
    foundPlayer = playerInfo[0] || foundPlayer[0];

    let lastOnlineDate = new Date(foundPlayer.lastOnline);
    let embed = new client.customEmbed();

    embed.setTitle(`${foundPlayer.name} - profile`)
      .addFields([{ name: '🚫 Banned', value: foundPlayer.banned ? '✔️' : '✖️' }])
      .addFields([{ name: '💰 Currency', value: foundPlayer.currency.toString() }])
      .addFields([{ name: '⏲️ Last online', value: lastOnlineDate.toDateString() }])
      .addFields([{ name: `💀 Deaths`, value: foundPlayer.deaths.toString() }])
      .addFields([{ name: `☠️ Zombie kills`, value: foundPlayer.zombieKills.toString() }])
      .addFields([{ name: `🔪 Player kills`, value: foundPlayer.playerKills.toString() }])
      .addFields([{ name: `💯 Score`, value: foundPlayer.score.toString() }])
      .addFields([{ name: `🆙 Level`, value: foundPlayer.level.toString() }])
      .setFooter({ text: `CSMM - ${sdtdServer.name}` });

    if (foundPlayer.avatarUrl) {
      embed.setImage(foundPlayer.avatarUrl);
    }


    return interaction.editReply({ embeds: [embed] });
  }
};

module.exports = Player;
