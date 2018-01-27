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
        this.serverId = serverId
        this.loggingObject = loggingObject
        this.config = config
        this.commands = CommandHandler.loadCommands.bind(this)()
        this.commandListener = CommandHandler.commandListener.bind(this)
        this.start()
      }
      /**
       * Start listening for commands
       */
      start() {
        this.commands = CommandHandler.loadCommands.bind(this)()
        let listenerFunction = this.commandListener
        this.loggingObject.on('chatMessage', listenerFunction);
      }

      /**
       * Stop listening for commands
       */

      stop() {
        let listenerFunction = this.commandListener
        this.loggingObject.removeListener('chatMessage', listenerFunction);
      }

      /**
       * Load enabled commands
       * @returns {Map}
       */

      static loadCommands() {

        let commands = new Map();
        let config = this.config

        const normalizedPath = require("path").join(__dirname, "commands");

        require("fs").readdirSync(normalizedPath).forEach(function (file) {
          let command = require("./commands/" + file);
          if (config.enabledCommands[command.name] === true) {
            commands.set(command.name.toLowerCase(), new command(config.server));
          }

        });

        return commands

      }

      /**
       * Attached to the logging event emitter
       * @param {json} chatMessage
       */

      static async commandListener(chatMessage) {

        try {
          if (chatMessage.messageText.startsWith(this.config.commandPrefix)) {
            let trimmedMsg = chatMessage.messageText.slice(this.config.commandPrefix.length, chatMessage.messageText.length)
            let splitString = trimmedMsg.split(' ')

            let commandName = splitString[0]
            let args = splitString.splice(1, splitString.length)

            if (this.commands.has(commandName)) {
              let player = await Player.find({name: chatMessage.playerName, server: this.config.server});
              player = player[0]

              let commandToRun = this.commands.get(commandName);

              return commandToRun.run(chatMessage, player.id, args)
            }
            sails.log.debug(`HOOK SdtdCommands:commandListener - Unknown command user by ${chatMessage.playerName} on server ${this.config.server}`)
          }
        } catch (error) {
          sails.log.error(`HOOK SdtdCommands:commandListener - ${error}`)
        }



      }
    }

    module.exports = CommandHandler
