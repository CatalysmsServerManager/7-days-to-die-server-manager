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
    this.extendedDescription = options.extendedDescription;
    this.aliases = options.aliases;
    this.validateCommand();
  }


  // Make sure the command has valid options
  async validateCommand() {

    if (_.isUndefined(this.name)) {
      throw new Error(`Implementation error! Must provide a name for 7dtd commands.`);
    }

    if (!_.isUndefined(this.aliases) && !_.isArray(this.aliases)) {
      throw new Error(`Aliases must be an array or undefined.`);
    }
  }


  async isEnabled() {
    throw new Error(`${this.constructor.name} does not have a isEnabled() method.`);
  }


  async run() {
    throw new Error(`${this.constructor.name} doesn't have a run() method.`);
  }
}

module.exports = SdtdCommand;
