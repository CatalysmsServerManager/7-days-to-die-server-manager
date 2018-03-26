let SdtdCommand = require('../command.js');

class tele extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'tele',
    });
    this.serverId = serverId;
  }

  async run(chatMessage, playerId) {
    console.log(chatMessage)
  }
}

module.exports = tele;
