//const commands = require('./commands');
const parseArgs = require('./parseArgs');
const findCommandToExecute = require('./findCommandToExecute');
const Sentry = require('@sentry/node');
const sendReplyToPlayer = require('./sendReply');

async function commandListener(job) {
  const chatMessage = job.data.data;
  const server = await SdtdServer.findOne(job.data.server.id).populate('config');
  server.config = server.config[0];

  let dateStarted = Date.now();
  if (!chatMessage.messageText.startsWith(server.config.commandPrefix)) {
    sails.log.debug(`HOOK SdtdCommands:commandListener - Unknown command used by ${chatMessage.playerName} on server ${server.name} - ${chatMessage.messageText}`, { server });
    return;
  }
  // Cut out the prefix
  const trimmedMsg = chatMessage.messageText.slice(server.config.commandPrefix.length, chatMessage.messageText.length);

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
      server: server.id
    });
  } else {
    player = await Player.find({
      name: _.trim(chatMessage.playerName),
      server: server.id
    });
  }


  if (player.length === 0) {
    sails.log.warn(`Did not find player data...`, { server });
    return;
  }


  let playerInfo = await sails.helpers.sdtd.loadPlayerData.with({
    serverId: server.id,
    steamId: player[0].steamId
  });
  player = { ...player[0], ...playerInfo[0] };

  // Function to easily reply to players in a command
  chatMessage.reply = async (message, data) => await sendReplyToPlayer(server, player, message, data);

  let commandToRun = await findCommandToExecute(commandName, server);

  if (commandToRun) {
    let commandIsEnabled = await commandToRun.isEnabled(chatMessage, player, server, args);

    if (!commandIsEnabled) {
      return;
    }

    try {
      await commandToRun.run(chatMessage, player, server, args, commandToRun.options);
      let dateEnded = Date.now();
      sails.log.info(`HOOK SdtdCommands - command ran by player ${player.name} on server ${server.name}. Took ${dateEnded - dateStarted} ms - ${chatMessage.messageText}`, { player, server });
      return;
    } catch (error) {
      Sentry.captureException(error);
      sails.log.error(`HOOK SdtdCommands - Error attempting to run ${chatMessage.messageText} on serverId ${server.id}: ${error}`, { server, player, error });
      await chatMessage.reply(`error`, { error: 'An unknown error occured' });
      return;
    }
  }


}

module.exports = commandListener;
