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
            type: 'memUpdate',
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
        let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({ serverId: server.id });
        let hoursToKeepData = sails.config.custom.donorConfig[donatorRole].memUpdateKeepDataHours
        let milisecondsToKeepData = hoursToKeepData * 3600000;
        let dateNow = Date.now();
        let borderDate = new Date(dateNow.valueOf() - milisecondsToKeepData);

        let deletedRecords = await HistoricalInfo.destroy({
            createdAt: { '<': borderDate.valueOf() },
            type: 'memUpdate',
            server: server.id
        }).fetch();
        
        if (deletedRecords.length > 5) {
            sails.log.info(`HOOKS - HistoricalInfo:memUpdate - Deleted ${deletedRecords.length} records for server ${server.name} - kept data for ${hoursToKeepData} hours.`)
        }
    } catch (error) {
        sails.log.error(`HOOKS - HistoricalInfo:memUpdate - Error deleting data -${error}`)
    }

}

module.exports = MemUpdate