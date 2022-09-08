const EventEmitter = require('events');

class DiscordMessageHandler {

  constructor() {
    this.emitter = undefined;
    this.init();
  }

  async init() {
    let client = sails.helpers.discord.getClient();
    let emitterObj = new GuildMessageEmitter();
    this.emitter = emitterObj;


    client.on('messageCreate', message => {
      if (message.guild) {
        emitterObj.emit(message.guild.id, message);
      }
    });

    sails.log.debug(`Initialized discordMessageHandler`);
  }


  getEmitter() {
    return this.emitter;
  }


}


class GuildMessageEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

module.exports = DiscordMessageHandler;
