class MemUpdate {
  constructor(server, config, loggingObject) {
    this.loggingObject = loggingObject;
    this.server = server;
    this.config = config;
    // Bind a updateListener function with this class so we can access server and config objects inside the event listener
    this.updateListener = this._updateListener.bind(this);
  }

  async start() {
    sails.log.silly(`started memUpdate for server ${this.server.name}`);
    this.loggingObject.on('memUpdate', this.updateListener);
  }

  async stop() {
    sails.log.silly(`stopped memUpdate  for server ${this.server.name}`);
    this.loggingObject.removeListener('memUpdate', this.updateListener);
  }

  async _updateListener(memUpdate) {
    sails.log.silly(`Received a mem update for server ${this.server.name}`);
    await sails.helpers.redis.set(`server:${this.server.id}:fps`, memUpdate.fps);
    await saveInfoToDatabase(this.server, memUpdate);

    let currentCycles = await sails.helpers.redis.get(`server:${this.server.id}:trackingCyclesCompleted`);
    currentCycles = parseInt(currentCycles);

    if (!currentCycles) {
      currentCycles = 1;
    }
    sails.log.debug(`HOOK - historicalInfo - checking if we need to delete data - ${currentCycles}/${sails.config.custom.trackingCyclesBeforeDelete} cycles`);
    if (currentCycles >= sails.config.custom.trackingCyclesBeforeDelete) {
      await clearOldInfo(this.server, this.config);
    }
  }

  get type() {
    return 'memUpdate';
  }
}


async function saveInfoToDatabase(server, memUpdate) {
  try {
    memUpdate.heap = memUpdate.heap.replace('MB', '');
    memUpdate.rss = memUpdate.rss.replace('MB', '');
    await Analytics.create({
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
    });
  } catch (error) {
    sails.log.error(`HOOKS - Analytics:memUpdate - Error saving data -${error}`);
  }
}

async function clearOldInfo(server) {
  try {
    let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({
      serverId: server.id
    });
    let hoursToKeepData = sails.config.custom.donorConfig[donatorRole].memUpdateKeepDataHours;
    let milisecondsToKeepData = hoursToKeepData * 3600000;
    let dateNow = Date.now();
    let borderDate = new Date(dateNow.valueOf() - milisecondsToKeepData);

    await Analytics.destroy({
      createdAt: {
        '<': borderDate.valueOf()
      },
      server: server.id
    });

    let dateEnded = Date.now();

    sails.log.debug(`Deleted historical data of type memUpdate for server ${server.id} - took ${dateEnded - dateNow} ms`);
  } catch (error) {
    sails.log.error(`HOOKS - Analytics:memUpdate - Error deleting data - ${error}`);
  }

}

module.exports = MemUpdate;
