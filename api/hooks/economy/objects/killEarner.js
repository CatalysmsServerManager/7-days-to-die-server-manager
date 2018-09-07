class KillEarner {
    constructor(server, config, loggingObject) {
        this.server = server
        this.config = config
        this.type = 'killEarner'
        this.loggingObject = loggingObject
        this.listenerFunc = handleKill.bind(this);
    }

    async start() {
        try {
            sails.log.debug(`Started kill earner for server ${this.server.name}`);
            this.loggingObject.on('zombieKill', this.listenerFunc);

            this.loggingObject.on('playerKill', this.listenerFunc);

        } catch (error) {
            sails.log.error(error)
        }
    }

    async stop() {
        sails.log.debug(`Stopped kill earner for server ${this.server.name}`);
        this.loggingObject.removeListener('zombieKill', this.listenerFunc);
        this.loggingObject.removeListener('playerKill', this.listenerFunc);

    }
}

async function handleKill(killEvent) {
    try {

        if (killEvent.zombiesKilled) {
            for (let index = 0; index < killEvent.zombiesKilled; index++) {
                let playerToReward = await Player.findOne({
                    server: this.server.id,
                    steamId: killEvent.steamId
                });
                await sails.helpers.economy.giveToPlayer.with({
                    playerId: playerToReward.id,
                    amountToGive: this.config.zombieKillReward,
                    message: `killEarner - Rewarding player for a zombie kill`
                });

            }
        }

        if (killEvent.playersKilled) {
            for (let index = 0; index < killEvent.playersKilled; index++) {
                let playerToReward = await Player.findOne({
                    server: this.server.id,
                    steamId: killEvent.steamId
                });
                await sails.helpers.economy.giveToPlayer.with({
                    playerId: playerToReward.id,
                    amountToGive: this.config.playerKillReward,
                    message: `killEarner - Rewarding player for a player kill`
                });

            }
        }
    } catch (error) {
        sails.log.error(error);
    }
}




module.exports = KillEarner

