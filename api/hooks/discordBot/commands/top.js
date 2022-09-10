const { SlashCommandBuilder } = require('discord.js');
const findSdtdServer = require('../util/findSdtdServer.js');
const getInteractionOption = require('../util/getInteractionOption.js');

const choices = [
  { name: 'currency', value: 'currency' },
  { name: 'zombies', value: 'zombies' },
  { name: 'players', value: 'players' },
  { name: 'deaths', value: 'deaths' },
  { name: 'playtime', value: 'playtime' },
  { name: 'score', value: 'score' },
  { name: 'level', value: 'level' },
];

const Top = {
  name: 'top',
  slashCommand: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Get the top players by a certain stat')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('The type of stat to get the top players for')
        .addChoices(...choices)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of players to show')
        .setMinValue(3)
        .setMaxValue(20)
    )
    .addIntegerOption(option =>
      option.setName('server')
        .setDescription('Which server to run this command against')
    ),

  handler: async (interaction, client) => {
    const serverIdx = getInteractionOption(interaction, 'server', 1) - 1;
    const amount = getInteractionOption(interaction, 'amount', 10);
    let type = getInteractionOption(interaction, 'type', 'playtime');

    const sdtdServer = await findSdtdServer(interaction, serverIdx);

    if (!sdtdServer) {
      return interaction.editReply(`Did not find server ${serverIdx}! Check your config please.`);
    }

    switch (type) {
      case 'zombies':
        type = 'zombieKills';
        break;
      case 'players':
        type = 'playerKills';
        break;

      default:
        break;
    }

    let embed = new client.customEmbed();

    let players = await Player.find({
      where: { server: sdtdServer.id },
      limit: amount,
      sort: `${type} DESC`,
    });

    embed.addFields(players.map(player => {
      return {
        name: player.name,
        value: type === 'playtime' ? ` ${playtimeToDDHHMMSS(player.playtime)}` : ` ${player[type]}`
      };
    }));

    embed.setTitle(`${sdtdServer.name} - Top ${amount} players by ${type}`);
    return interaction.editReply({ embeds: [embed] });
  }
};

function playtimeToDDHHMMSS(playtime) {
  let days = Math.floor(playtime / 86400);
  playtime %= 86400;
  let hours = Math.floor(playtime / 3600);
  playtime %= 3600;
  let minutes = Math.floor(playtime / 60);
  let seconds = playtime % 60;
  return `${days} D, ${hours} H, ${minutes} M, ${seconds} S`;
}


module.exports = Top;
