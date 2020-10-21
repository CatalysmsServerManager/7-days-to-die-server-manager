// TODO: moved to worker, this should be deleted
// This is a quick patch though
// Full economy hook should be moved over ideally
class KillEarner {
  constructor(server, config, loggingObject) {
    this.server = server;
    this.config = config;
    this.type = 'killEarner';
    this.loggingObject = loggingObject;
    this.listenerFunc = handleKill.bind(this);
    this.zombieKillSubscriber;
    this.playerKillSubscriber;
  }

  async start() {
    sails.log.debug(`Started kill earner for server ${this.server.name}`);
  }

  async stop() {
    sails.log.debug(`Stopped kill earner for server ${this.server.name}`);
  }
}

async function handleKill(

) {

}

module.exports = KillEarner;

