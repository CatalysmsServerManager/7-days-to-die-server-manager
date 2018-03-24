let SdtdCommand = require('../command.js');

class setTele extends SdtdCommand {
  constructor(serverId) {
    super(serverId, {
      name: 'settele',
    });
    this.serverId = serverId;
  }

  async run(chatMessage, playerId) {
    console.log(chatMessage)
  }
}

module.exports = setTele;
