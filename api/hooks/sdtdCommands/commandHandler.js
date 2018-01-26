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
        this.commandListener = CommandHandler.commandListener.bind(this)
        this.config = config
        this.start()
      }
      /**
       * Start listening for commands
       */
      start() {
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
       */

      static loadCommands() {

      }

      /**
       * Attached to the logging event emitter
       * @param {json} chatMessage
       */

      static commandListener(chatMessage) {
        if (chatMessage.messageText.startsWith(this.config.commandPrefix)) {
          console.log('command detected')
        }

      }
    }

    module.exports = CommandHandler
