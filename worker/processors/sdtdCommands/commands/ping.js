const SdtdCommand = require('../command.js');

class Ping extends SdtdCommand {
  constructor() {
    super({
      name: 'ping',
      description: 'PONG!',
      extendedDescription: 'Check CSMM response time',
      aliases: []
    });
  }

  async isEnabled() {
    return true;
  }

  async run(chatMessage) {
    return chatMessage.reply('PONG');
  }
}

module.exports = Ping;
