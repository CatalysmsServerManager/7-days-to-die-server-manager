const sevenDays = require('machinepack-7daystodiewebapi');
const CustomCommand = require('./customCommand.js');
const he = require('he');
const parseArgs = require('./parseArgs');
const Sentry = require('@sentry/node');

/**
 * @memberof module:SdtdCommandsHook
 * @name commandHandler
 * @param {number} serverId
 * @param {loggingObject} loggingObject Obtained from the logging hook
 * @param {json} config Server commands config
 * @description Handles ingamecommands on a server
 */


class CommandHandler {
  constructor(serverId, loggingObject, config) {
    this.serverId = serverId;
    this.loggingObject = loggingObject;
    this.config = config;
    this.commands = CommandHandler.loadCommands.bind(this)();
    this.commandListener = CommandHandler.commandListener.bind(this);
    this.start();
  }
  /**
   * Start listening for commands
   */
  start() {
    this.commands = CommandHandler.loadCommands.bind(this)();
    let listenerFunction = this.commandListener;
    this.loggingObject.on('chatMessage', listenerFunction);
  }

  /**
   * Stop listening for commands
   */

  stop() {
    let listenerFunction = this.commandListener;
    this.loggingObject.removeListener('chatMessage', listenerFunction);
  }

  /**
   * Load commands
   * @returns {Map}
   */

  static loadCommands() {

    let commands = new Map();
    let config = this.config;

    const normalizedPath = require('path').join(__dirname, 'commands');

    require('fs').readdirSync(normalizedPath).forEach((file) => {
      let command = require('./commands/' + file);
      let commandInst = new command(config.server);
      commandInst.commandHandler = this;
      commands.set(command.name.toLowerCase(), commandInst);

    });

    return commands;

  }

  /**
   * Attached to the logging event emitter
   * @param {json} chatMessage
   */

  static async commandListener(chatMessage) {
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
            sails.log.error(error);
            chatMessage.reply(`error`, { error: 'An unknown error occured' });
            Sentry.captureException(err);
            return;
          }
        }

        sails.log.debug(`HOOK SdtdCommands:commandListener - Unknown command used by ${chatMessage.playerName} on server ${server.name} - ${chatMessage.messageText}`);
      }
    } catch (error) {
      sails.log.error(error);
    }

  }

  async findCommandToExecute(commandName) {
    if (this.commands.has(commandName)) {
      let commandToRun = this.commands.get(commandName);
      return commandToRun;
    }

    let aliasFound = false;

    this.commands.forEach((command) => {
      let idx = _.findIndex(command.aliases, (alias => commandName === alias));
      if (idx !== -1) {
        aliasFound = command;
      }
    });

    if (aliasFound) {
      return aliasFound;
    }

    let customCommands = await sails.models.customcommand.find({
      server: this.serverId,
      enabled: true,
      name: commandName
    }).populate('arguments');

    let customCommandFound = false;

    customCommands.forEach(command => {
      customCommandFound = new CustomCommand(this.serverId, command);
    });

    if (customCommandFound) {
      return customCommandFound;
    }

    return undefined;
  }
}

module.exports = CommandHandler;



async function sendReplyToPlayer(server, player, type, data) {

  function getReplyObj(type) {
    return sails.hooks.sdtdcommands.replyTypes.filter(r => r.type === type)[0];
  }

  async function getMessage(replyObj) {
    let response = await CommandReply.find({
      type: replyObj.type,
      server: server.id
    });
    if (response.length === 0) {
      return replyObj.default;
    }
    return response[0].reply;
  }

  return new Promise(async (resolve, reject) => {

    const replyObj = getReplyObj(type);

    if (!replyObj) {
      return sendMsg(type);
    } else {

      let message = await getMessage(replyObj);
      if (!data) {
        data = {};
      }
      data.server = server;
      data.player = player;
      message = await sails.helpers.sdtd.fillCustomVariables(message, data);
      return sendMsg(message);
    }


    function sendMsg(message) {
      return sevenDays.sendMessage({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        message: `${message}`,
        playerId: player.steamId
      }).exec({
        error: (error) => {
          sails.log.error(`HOOK - SdtdCommands - Failed to respond to player`);
          reject(error);
        },
        success: (result) => {
          resolve(result);
        }
      });
    }


  });
}
