const EventEmitter = require('events');

class DiscordMessageHandler {

    constructor() {
        this.emitter = undefined
        this.init();   
    }

    async init() {
        let client = sails.hooks.discordbot.getClient();
        let emitterObj =  new GuildMessageEmitter();
        this.emitter = emitterObj;


        client.on('message', message => {
            emitterObj.emit(message.guild.id, message);
        })

        sails.log.debug(`Initialized discordMessageHandler`);
    }


    getEmitter() {
        return this.emitter
    }


}


class GuildMessageEmitter extends EventEmitter {
    constructor() {
        super();
    }
}

module.exports = DiscordMessageHandler