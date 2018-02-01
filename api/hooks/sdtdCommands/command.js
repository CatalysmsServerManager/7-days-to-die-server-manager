/**
     * @memberof module:SdtdCommandsHook
     * @name SdtdCommand
     * @param {number} serverId
     * @description Abstract class to represent ingame commands
     */

class SdtdCommand {
  constructor(serverId) {
    /**
         * @param {number} serverId
         * @name SdtdCommand#serverId
         */
    this.serverId;
  }


  async run(chatMessage, playerId) {
    throw new Error(`${this.constructor.name} doesn't have a run() method.`);
  }
}

module.exports = SdtdCommand;
