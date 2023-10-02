const { SlashCommandBuilder } = require('discord.js');
const findSdtdServer = require('../util/findSdtdServer.js');
const getInteractionOption = require('../util/getInteractionOption.js');

const Status = {
  name: 'status',
  slashCommand: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Shows some basic info about a server')
    .addIntegerOption(option =>
      option.setName('server')
        .setDescription('Which server to run this command against')
    ),

  handler: async (interaction, client) => {
    const serverIdx = getInteractionOption(interaction, 'server', 1) - 1;

    const sdtdServer = await findSdtdServer(interaction, serverIdx);

    if (!sdtdServer) {
      return interaction.editReply(`Did not find server ${serverIdx}! Check your config please.`);
    }


    let serverInfo = await sails.helpers.loadSdtdserverInfo(sdtdServer.id);
    let playerInfo = await sails.helpers.sdtd.loadPlayerData.with({ serverId: sdtdServer.id, onlyOnline: true });
    let fps;

    try {
      fps = await sails.helpers.sdtd.loadFps(sdtdServer.id);
    } catch (error) {
      fps = 'Cannot load FPS =(';
    }

    if (!serverInfo.stats || !serverInfo.serverInfo) {
      return interaction.editReply(`Could not load required data. Is the server offline?`);
    }

    let onlinePlayersStringList = new String();

    playerInfo.forEach(player => {
      onlinePlayersStringList += `${player.name}, `;
    });

    let bloodMoonDay;
    let nextHorde;

    try {
      bloodMoonDay = await sails.helpers.sdtdApi.executeConsoleCommand(
        SdtdServer.getAPIConfig(sdtdServer),
        `ggs BloodMoonDay`
      );
      nextHorde = parseInt(bloodMoonDay.result.split(` = `)[1], 10);
    } catch (error) {
      sails.log.warn(`Hook - discordBot:status - ${error}`, { server: sdtdServer });
      sails.log.error(error, { server: sdtdServer });
    }
    const daysUntilHorde = nextHorde - serverInfo.stats.gametime.days;

    let embed = new client.customEmbed();

    embed.setTitle(`${serverInfo.name} - status`)
      .addFields([
        {
          name: 'FPS', value: `${fps}`
        },
        {
          name: `Gametime`, value: `${serverInfo.stats.gametime.days} days ${serverInfo.stats.gametime.hours} hours ${serverInfo.stats.gametime.minutes} minutes
      Next horde in ${bloodMoonDay ? daysUntilHorde : `unknown`} days`
        },
        { name: `${serverInfo.stats.hostiles} hostiles`, value: `${serverInfo.stats.animals} animals` },
        { name: `${serverInfo.stats.players} players online`, value: onlinePlayersStringList.length > 0 ? onlinePlayersStringList : 'None' },
      ]);



    if (fps > 15) {
      embed.setColor([0, 255, 0]);
    }

    if (5 < fps && fps < 15) {
      embed.setColor([255, 255, 0]);
    }

    if (fps < 5) {
      embed.setColor([255, 0, 0]);
    }

    return interaction.editReply({ embeds: [embed] });
  }
};

module.exports = Status;
