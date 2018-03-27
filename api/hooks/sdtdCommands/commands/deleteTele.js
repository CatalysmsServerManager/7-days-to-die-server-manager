let SdtdCommand = require('../command.js');

class deleteTele extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'deletetele',
    });
    this.serverId = serverId;
  }

  async run(chatMessage, playerId) {
    console.log(chatMessage)
  }
}

module.exports = deleteTele;
