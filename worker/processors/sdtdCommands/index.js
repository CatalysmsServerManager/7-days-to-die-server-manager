//const commands = require('./commands');


async function commandListener(job) {
  const {chatMessage} = job.data;
  let dateStarted = Date.now();
  try {
    if (chatMessage.messageText.startsWith(this.config.commandPrefix)) {
      // Cut out the prefix
      const trimmedMsg = chatMessage.messageText.slice(this.config.commandPrefix.length, chatMessage.messageText.length);

      const splitString = trimmedMsg.split(' ');
      const commandName = splitString[0];
      const splitArgs = parseArgs(trimmedMsg);
      const args = splitArgs.splice(1, splitArgs.length);

      if (chatMessage.playerName === 'Server') {
        return;
      }
      let player;

      if (chatMessage.steamId) {
        player = await Player.find({
          steamId: chatMessage.steamId,
          server: this.config.server
        });
      } else {
        player = await Player.find({
          name: he.encode(_.trim(chatMessage.playerName)),
          server: this.config.server
        });
      }


      if (player.length === 0) {
        sails.log.warn(`Did not find player data...`, chatMessage);
      }


      let playerInfo = await sails.helpers.sdtd.loadPlayerData.with({
        serverId: this.config.server,
        steamId: player[0].steamId
      });
      player = playerInfo[0];
      let server = await SdtdServer.findOne(player.server).populate('players');
      server.config = await SdtdConfig.findOne({
        server: server.id
      });

      // Function to easily reply to players in a command
      chatMessage.reply = async (message, data) => await sendReplyToPlayer(server, player, message, data);

      let commandToRun = await this.findCommandToExecute(commandName);

      if (commandToRun) {
        let commandIsEnabled = await commandToRun.isEnabled(chatMessage, player, server, args);

        if (!commandIsEnabled) {
          return chatMessage.reply(`commandDisabled`);
        }

        try {
          await commandToRun.run(chatMessage, player, server, args, commandToRun.options);
          let dateEnded = Date.now();
          sails.log.info(`HOOK SdtdCommands - command ran by player ${player.name} on server ${server.name}. Took ${dateEnded - dateStarted} ms - ${chatMessage.messageText}`);
          return;
        } catch (error) {
          Sentry.captureException(error);
          sails.log.info(`HOOK SdtdCommands - Error attempting to run ${chatMessage.messageText} on serverId ${server.id}: ${error}`);
          chatMessage.reply(`error`, { error: 'An unknown error occured' });
          return;
        }
      }

      sails.log.debug(`HOOK SdtdCommands:commandListener - Unknown command used by ${chatMessage.playerName} on server ${server.name} - ${chatMessage.messageText}`);
    }
  } catch (error) {
    sails.log.error(error);
  }
}

module.exports = commandListener;
