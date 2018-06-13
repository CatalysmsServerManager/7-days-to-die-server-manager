const sevenDays = require('machinepack-7daystodiewebapi');
const CustomCommand = require('./customCommand.js');
const he = require('he');

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

    require('fs').readdirSync(normalizedPath).forEach(function (file) {
      let command = require('./commands/' + file);
      commands.set(command.name.toLowerCase(), new command(config.server));

    });

    return commands;

  }

  /**
       * Attached to the logging event emitter
       * @param {json} chatMessage
       */

  static async commandListener(chatMessage) {

    try {
      if (chatMessage.messageText.startsWith(this.config.commandPrefix)) {
        // Cut out the prefix
        let trimmedMsg = chatMessage.messageText.slice(this.config.commandPrefix.length, chatMessage.messageText.length);

        let splitString = trimmedMsg.split(' ');
        let commandName = splitString[0];
        let args = splitString.splice(1, splitString.length);

        if (chatMessage.playerName === "Server") {
          return
        }

        let player = await Player.find({ name: he.encode(_.trim(chatMessage.playerName)), server: this.config.server });

        if (player.length === 0) {
          sails.log.warn(`Did not find player data...`, chatMessage);
        }

        let playerInfo = await sails.helpers.sdtd.loadPlayerData.with({ serverId: this.config.server, steamId: player[0].steamId })
        player = playerInfo[0]
        let server = await SdtdServer.findOne(player.server).populate('players');
        server.config = await SdtdConfig.findOne({ server: server.id });

        // Function to easily reply to players in a command
        chatMessage.reply = async message => await sendReplyToPlayer(server, player, message);

        let commandToRun = await this.findCommandToExecute(commandName);

        if (commandToRun) {
          try {
            await commandToRun.run(chatMessage, player, server, args, commandToRun.options);
            sails.log.debug(`HOOK SdtdCommands - command ran by player ${player.name} on server ${server.name} - ${chatMessage.messageText}`)
            return
          } catch (error) {
            sails.log.error(error)
            chatMessage.reply(`An error occured! Please report this on the development server. ${error}`);
            return
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
      return commandToRun
    }

    let customCommands = await sails.models.customcommand.find({
      server: this.serverId,
      enabled: true,
      name: commandName
    });

    let customCommandFound = false

    customCommands.forEach(command => {
      customCommandFound = new CustomCommand(this.serverId, command);
    })

    if (customCommandFound) {
      return customCommandFound
    }

    return undefined
  }
}

module.exports = CommandHandler;



async function sendReplyToPlayer(server, player, message) {
  return new Promise((resolve, reject) => {
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
        reject(error)
      },
      success: (result) => {
        resolve(result)
      }
    });
  })
}