class DiscordTextEarner {
    constructor(server, config, messageEmitter) {
        this.messageEmitter = messageEmitter
        this.server = server
        this.config = config
        this.type = 'discordTextEarner'
        this.messageHandler = handleMessage.bind(this);
    }

    async start() {
        try {
            sails.log.debug(`Started discord text earner for server ${this.server.name}`);
            this.messageEmitter.on(this.config.discordGuildId, this.messageHandler);

        } catch (error) {
            sails.log.error(error)
        }
    }

    async stop() {
        sails.log.debug(`Stopped discord text earner for server ${this.server.name}`);
        this.messageEmitter.removeListener(this.config.discordGuildId, this.messageHandler);


    }
}


async function handleMessage(message) {
    let discordUser = message.author;
    let userWithDiscordId = await User.find({ discordId: discordUser.id }).limit(1);

    if (userWithDiscordId.length === 0) {
        return
    }

    let playersToReward = await Player.find({ user: userWithDiscordId.id, server: this.server.id }).limit(1);

    if (playersToReward.length === 0) {
        return
    }

    await sails.helpers.economy.giveToPlayer.with({ playerId: playersToReward[0].id, amountToGive: this.config.discordTextEarnerAmountPerMessage, message: `discordTextEarner - awarding player for sending a message in discord` });
}



module.exports = DiscordTextEarner

