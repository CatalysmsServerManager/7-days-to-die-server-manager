class MemUpdate {
  constructor(server, config, loggingObject) {
    this.loggingObject = loggingObject;
    this.server = server;
    this.config = config;
    // Bind a updateListener function with this class so we can access server and config objects inside the event listener
    this.updateListener = this._updateListener.bind(this);
  }

  async start() {
    sails.log.debug(`started memUpdate for server ${this.server.name}`, {server: this.server});
    this.loggingObject.on('memUpdate', this.updateListener);
  }

  async stop() {
    sails.log.debug(`stopped memUpdate  for server ${this.server.name}`, {server: this.server});
    this.loggingObject.removeListener('memUpdate', this.updateListener);
  }

  async _updateListener(memUpdate) {
    sails.log.debug(`Received a mem update for server ${this.server.name}`, {server: this.server});
    await sails.helpers.redis.set(`server:${this.server.id}:fps`, memUpdate.fps);
    await saveInfoToDatabase(this.server, memUpdate);
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
    sails.log.error(`HOOKS - Analytics:memUpdate - Error saving data -${error}`, {server});
  }
}

module.exports = MemUpdate;
