class DiscordTextEarner {
    constructor(server, config, loggingObject) {
        this.loggingObject = loggingObject
        this.server = server
        this.config = config
        this.type = 'discordTextEarner'
    }

    async start() {
        try {
            sails.log.debug(`Started discord text earner for server ${this.server.name}`);

        } catch (error) {
            sails.log.error(error)
        }
    }

    async stop() {
        sails.log.debug(`Stopped discord text earner for server ${this.server.name}`);


    }
}


module.exports = DiscordTextEarner

