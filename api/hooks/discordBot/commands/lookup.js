const { SlashCommandBuilder } = require('discord.js');
const findSdtdServer = require('../util/findSdtdServer.js');
const getInteractionOption = require('../util/getInteractionOption.js');

const Lookup = {
  name: 'lookup',
  slashCommand: new SlashCommandBuilder()
    .setName('lookup')
    .setDescription('Lookup a player profile')
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
      return interaction.reply(`Did not find server ${serverIdx}! Check your config please.`);
    }

    let permCheck = await sails.helpers.roles.checkPermission.with({
      serverId: sdtdServer.id,
      discordId: interaction.user.id,
      permission: 'discordLookup'
    });

    if (!permCheck.hasPermission) {
      const errorEmbed = new client.errorEmbed(`You do not have sufficient permissions to execute this command. Your registered role is ${permCheck.role.name}. Contact your server admin if you think you should have a higher role.`);

      let usersWithDiscordId = await User.find({
        discordId: interaction.user.id,
      });

      if (usersWithDiscordId.length === 0) {
        errorEmbed.addFields([{ name: `No users with your discord ID ${msg.author.id} found!`, value: 'Link your Discord profile to CSMM first.' }]);
      }
      return interaction.reply({ embeds: [errorEmbed] });
    }

    let foundPlayer = await sails.models.player.find({
      server: sdtdServer.id,
      or: [{
        name: {
          'contains': player
        },
      },
      {
        entityId: isNaN(parseInt(player)) ? -1 : player
      },
      {
        steamId: player
      },
      ]
    });

    if (foundPlayer.length === 0) {
      return interaction.reply(`Did not find any players with that name/ID!`);
    }

    if (foundPlayer.length > 1) {
      return interaction.reply(`Found ${foundPlayer.length} players! Narrow your search please. Consider using steam ID or entity ID instead of player name`);
    }

    let playerInfo = await sails.helpers.sdtd.loadPlayerData.with({
      serverId: sdtdServer.id,
      steamId: foundPlayer[0].steamId
    });
    foundPlayer = playerInfo[0] || foundPlayer[0];
    let lastOnlineDate = new Date(foundPlayer.lastOnline);

    let lastOnlineTimeAgo = await sails.helpers.etc.humanizedTime(lastOnlineDate);
    let embed = new client.customEmbed();


    embed.setTitle(`${foundPlayer.name} - profile`)
      .addFields([{ name: '🚫 Banned', value: foundPlayer.banned ? '✔️' : '✖️' }])
      .addFields([{ name: '💰 Currency', value: foundPlayer.currency ? foundPlayer.currency : '0' }])
      .addFields([{ name: '⏲️ Last online', value: `${lastOnlineDate.toDateString()} - ${lastOnlineTimeAgo}` }])
      .addFields([{ name: '🗺️ Location', value: `${foundPlayer.positionX} ${foundPlayer.positionY} ${foundPlayer.positionZ}` }])
      .addFields([{ name: '🖧 IP', value: foundPlayer.ip ? foundPlayer.ip : 'Unknown' }])
      .addFields([{ name: '👤 Profile', value: `${process.env.CSMM_HOSTNAME}/player/${foundPlayer.id}/profile` }])
      .setFooter({ text: `CSMM - ${sdtdServer.name}` });

    if (foundPlayer.avatarUrl) {
      embed.setThumbnail(foundPlayer.avatarUrl);
    }

    return interaction.reply({ embeds: [embed] });

  }
};

module.exports = Lookup;
