let SdtdCommand = require('../command.js')

class sayHi extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'sayhi',
        })
        this.serverId = serverId
    }

    async run(chatMessage, playerId) {
        console.log(`Hey player ${playerId} called ${chatMessage.playerName} on server ${this.serverId}`)
    }
}

module.exports = sayHi