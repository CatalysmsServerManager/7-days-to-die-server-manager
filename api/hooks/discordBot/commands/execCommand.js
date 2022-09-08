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
    ),

  handler: async (interaction, client) => {
    const serverIdx = getInteractionOption(interaction, 'server', 1) - 1;
    const command = getInteractionOption(interaction, 'command');

    const sdtdServer = await findSdtdServer(interaction, serverIdx);

    if (!sdtdServer) {
      return interaction.reply(`Did not find server ${serverIdx}! Check your config please.`);
    }

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
      return interaction.reply(errorEmbed);
    }


    const response = await sails.helpers.sdtdApi.executeConsoleCommand(
      SdtdServer.getAPIConfig(sdtdServer),
      command
    );

    let successEmbed = new client.customEmbed;
    successEmbed.setFooter({ text: `Server: ${sdtdServer.name}` });
    successEmbed.addFields([{ name: ':inbox_tray: Input', value: `${command}` }])
      .setColor([0, 255, 48]);

    if (response.result.length < 1000) {
      successEmbed.addFields([{ name: ':outbox_tray: Output', value: `${response.result ? response.result : 'No output data'}` }]);
      return interaction.reply({ embeds: [successEmbed] });
    }

    const fileName = `${sdtdServer.name}_${command}_output.txt`;
    try {
      await fs.writeFile(fileName, response.result);
      successEmbed.addFields([{ name: ':outbox_tray: Output', value: `Logging to file` }]);
      await interaction.reply({ embeds: [successEmbed], files: [{ name: fileName, description: 'Output of the command', attachment: fileName }] });
    } catch (error) {
      sails.log.error(`Error handling large command output`, { error });
      await interaction.reply({ embeds: [successEmbed] });
    } finally {
      await fs.unlink(fileName);
    }


  }
};



module.exports = ExecCommand;
