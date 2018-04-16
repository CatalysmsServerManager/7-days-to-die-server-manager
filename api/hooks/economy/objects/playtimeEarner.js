class PlaytimeEarner {
    constructor(server, config, loggingObject) {
        this.loggingObject = loggingObject
        this.server = server
        this.config = config
        this.type = 'playtimeEarner'
        this.interval = undefined
        this.intervalFunc = loadOnlinePlayersAndAwardMoney.bind(this);
        // Bind a updateListener function with this class so we can access server and config objects inside the event listener
        // this.updateListener = this._updateListener.bind(this);
    }

    async start() {
        try {
            sails.log.debug(`Started playtime earner for server ${this.server.name}`);

            this.interval = setInterval(this.intervalFunc, 300000)
        } catch (error) {
            sails.log.error(error)
        }


    }

    async stop() {
        sails.log.debug(`Stopped playtime earner for server ${this.server.name}`);
        clearInterval(this.interval);

    }


}


module.exports = PlaytimeEarner


async function loadOnlinePlayersAndAwardMoney() {
    try {
        let onlinePlayers = await sails.helpers.loadPlayerData.with({ serverId: this.server.id, onlyOnline: true});
        onlinePlayers.players.forEach(async player => {
            await sails.helpers.economy.giveToPlayer.with({playerId: player.id, amountToGive: 1, message: `playtimeEarner - awarding player cash for playing on the server`})
        })
    } catch (error) {
        sails.log.error(error)
    }
}