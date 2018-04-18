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

            this.interval = setInterval(this.intervalFunc, this.config.playtimeEarnerInterval * 60000)
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
            await sails.helpers.economy.giveToPlayer.with({playerId: player.id, amountToGive: this.config.playtimeEarnerAmount, message: `playtimeEarner - awarding player cash for playing on the server`})
        })
        await cleanOldLogs(this.server.id)
    } catch (error) {
        sails.log.error(error)
    }
}


async function cleanOldLogs(serverId) {
    try {
        let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({ serverId: serverId });
        console.log(donatorRole)
        let hoursToKeepData = sails.config.custom.donorConfig[donatorRole].economyKeepDataHours
        let milisecondsToKeepData = hoursToKeepData * 3600000;
        let dateNow = Date.now();
        let borderDate = new Date(dateNow.valueOf() - milisecondsToKeepData);
   
        let deletedRecords = await HistoricalInfo.destroy({
            server: serverId,
            type: 'economy',
            createdAt: { '<': borderDate.valueOf() },
        }).fetch()
        console.log(`deleted ${deletedRecords.length} records`)
    } catch (error) {
        sails.log.error(error)
    }
}