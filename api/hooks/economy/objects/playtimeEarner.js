class PlaytimeEarner {
  constructor(server, config) {
    this.server = server;
    this.config = config;
    this.type = 'playtimeEarner';
    this.interval = undefined;
    this.intervalFunc = loadOnlinePlayersAndAwardMoney.bind(this);
    // Bind a updateListener function with this class so we can access server and config objects inside the event listener
    // this.updateListener = this._updateListener.bind(this);
  }

  async start() {
    try {
      sails.log.debug(`Started playtime earner for server ${this.server.name}`);

      if (this.config.playtimeEarnerInterval < 1) {
        sails.log.error(
          `Cannot use interval ${this.config.playtimeEarnerInterval} for playtimeEarner, it is too small!`
        );
        return;
      }

      this.interval = setInterval(
        this.intervalFunc,
        this.config.playtimeEarnerInterval * 60000
      );
    } catch (error) {
      sails.log.error(error);
    }
  }

  async stop() {
    sails.log.debug(`Stopped playtime earner for server ${this.server.name}`);
    clearInterval(this.interval);
  }
}

async function loadOnlinePlayersAndAwardMoney() {
  try {
    let onlinePlayers = await sails.helpers.sdtd.loadPlayerData.with({
      serverId: this.server.id,
      onlyOnline: true
    });
    onlinePlayers.forEach(async player => {
      await sails.helpers.economy.giveToPlayer.with({
        playerId: player.id,
        amountToGive: this.config.playtimeEarnerAmount,
        message: `playtimeEarner - awarding player cash for playing on the server`
      });
    });
  } catch (error) {
    sails.log.error(error);
  }
}

module.exports = PlaytimeEarner;
