class MemUpdate {
    constructor(server, config, loggingObject) {
        this.loggingObject = loggingObject
        this.server = server
        this.config = config
        // Bind a updateListener function with this class so we can access server and config objects inside the event listener
        this.updateListener = this._updateListener.bind(this);
    }

    async start() {
        sails.log.silly(`started memUpdate for server ${this.server.name}`)
        this.loggingObject.on('memUpdate', this.updateListener)
    }

    async stop() {
        sails.log.silly(`stopped memUpdate  for server ${this.server.name}`)
        this.loggingObject.removeListener('memUpdate', this.updateListener)
    }

    async _updateListener(memUpdate) {
        sails.log.silly(`Received a mem update for server ${this.server.name}`)
        await saveInfoToDatabase(this.server, memUpdate);
        await clearOldInfo(this.server, this.config);
    }

    get type() {
        return 'memUpdate'
    }
}


async function saveInfoToDatabase(server, memUpdate) {
    try {
        memUpdate.heap = memUpdate.heap.replace('MB', '');
        memUpdate.rss = memUpdate.rss.replace('MB', '');
        await HistoricalInfo.create({
            server: server.id,
            fps: memUpdate.fps,
            heap: memUpdate.heap,
            chunks: memUpdate.chunks,
            zombies: memUpdate.zombies,
            entities: memUpdate.entities,
            players: memUpdate.players,
            items: memUpdate.items,
            rss: memUpdate.rss,
            uptime: memUpdate.uptime
        })
    } catch (error) {
        sails.log.error(`HOOKS - HistoricalInfo:memUpdate - Error saving data -${error}`)
    }
}

async function clearOldInfo(server, config) {
    try {
        let daysToKeepData = config.daysToKeepData
        let secondsToKeepData = daysToKeepData * 24 * 60;
        let borderDate = new Date();
        borderDate.setSeconds(borderDate.getSeconds() - secondsToKeepData);
        let epochTimeToDeleteFrom = borderDate.valueOf();
        await HistoricalInfo.destroy({
            createdAt: { '<': epochTimeToDeleteFrom }
        })
    } catch (error) {
        sails.log.error(`HOOKS - HistoricalInfo:memUpdate - Error deleting data -${error}`)
    }

}

module.exports = MemUpdate