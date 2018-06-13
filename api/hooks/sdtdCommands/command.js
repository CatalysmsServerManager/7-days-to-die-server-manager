/**
     * @memberof module:SdtdCommandsHook
     * @name SdtdCommand
     * @param {number} serverId
     * @description Abstract class to represent ingame commands
     */

class SdtdCommand {
  constructor(serverId, options) {
    /**
         * @param {number} serverId
         * @name SdtdCommand#serverId
         */
    this.serverId;
    this.name = options.name;
    this.description = options.description;
    this.aliases = new Array();
  }


  async isEnabled() {
    throw new Error(`${this.constructor.name} does not have a isEnabled() method.`)
  }


  async run(chatMessage, playerId) {
    throw new Error(`${this.constructor.name} doesn't have a run() method.`);
  }
}

module.exports = SdtdCommand;
