const { SlashCommandBuilder } = require('discord.js');
const findSdtdServer = require('../util/findSdtdServer.js');
const fs = require('fs/promises');
const getInteractionOption = require('../util/getInteractionOption.js');

const ExecCommand = {
  name: 'execute-command',
  slashCommand: new SlashCommandBuilder()
    .setName('execute-command')
    .setDescription('Execute a command on a 7D2D server')

    .addStringOption(option =>
      option.setName('command')
        .setDescription('Command to execute')
        .setRequired(true)
    ).addIntegerOption(option =>
      option.setName('server')
        .setDescription('Which server to run this command against')
    ).addBooleanOption(option =>
      option.setName('all-servers')
        .setDescription('Execute the command on all servers instead of just one')
    ),

  handler: async (interaction, client) => {
    const serverIdx = getInteractionOption(interaction, 'server', 1) - 1;
    const command = getInteractionOption(interaction, 'command');
    const executeOnAllServers = getInteractionOption(interaction, 'all-servers', false);

    const serversToExecuteOn = [];

    if (executeOnAllServers) {
      const servers = await findSdtdServer(interaction, 'all');
      serversToExecuteOn.push(...servers);
    } else {
      const sdtdServer = await findSdtdServer(interaction, serverIdx);

      if (!sdtdServer) {
        return interaction.editReply(`Did not find server ${serverIdx}! Check your config please.`);
      }

      serversToExecuteOn.push(sdtdServer);
    }

    if (!serversToExecuteOn.length) {
      return interaction.editReply(`Did not find any servers! Check your config please.`);
    }

    for (const sdtdServer of serversToExecuteOn) {
      let permCheck = await sails.helpers.roles.checkPermission.with({
        serverId: sdtdServer.id,
        discordId: interaction.user.id,
        permission: 'discordExec'
      });

      if (!permCheck.hasPermission) {
        let errorEmbed = new client.errorEmbed(`You do not have sufficient permissions to execute this command. Your registered role is ${permCheck.role.name}. Contact your server admin if you think you should have a higher role.`);

        let usersWithDiscordId = await User.find({
          discordId: interaction.user.id
        });

        if (usersWithDiscordId.length === 0) {
          errorEmbed.addFields([{ name: `No users with your discord ID ${interaction.user.id} found!`, value: 'Link your Discord profile to CSMM first.' }]);
        }
        return interaction.editReply(errorEmbed);
      }
    }

    let successEmbed = new client.customEmbed;
    successEmbed.setFooter({ text: `Server: ${executeOnAllServers ? 'all' : serversToExecuteOn[0].name}` })
      .setColor([0, 255, 48])
      .addFields([{ name: ':inbox_tray: Input', value: `${command}` }]);

    const attachments = (await Promise.all(serversToExecuteOn.map(async sdtdServer => {
      return await handleExecution(successEmbed, sdtdServer, command);
    }))).filter(Boolean);

    await interaction.editReply({ embeds: [successEmbed], files: attachments });
    await Promise.all(attachments.map(async attachment => {
      await fs.unlink(attachment.attachment);
    }));
  }
};

async function handleExecution(embed, sdtdServer, command) {
  const response = await sails.helpers.sdtdApi.executeConsoleCommand(
    SdtdServer.getAPIConfig(sdtdServer),
    command
  );

  if (response.result.length < 1000) {
    embed.addFields([{ name: `:outbox_tray: Output ${sdtdServer.name}`, value: `${response.result ? response.result : 'No output data'}` }]);
  } else {
    const fileName = `${sdtdServer.name}_${command}_output.txt`;
    await fs.writeFile(fileName, response.result);
    embed.addFields([{ name: `:outbox_tray: Output ${sdtdServer.name}`, value: `Logging to file` }]);
    return { name: fileName, description: 'Output of the command', attachment: fileName };
  }
}



module.exports = ExecCommand;
