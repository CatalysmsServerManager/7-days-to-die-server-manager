module.exports = async (job) => {
  sails.log.debug('[Worker] Got a `kill` job', job.data);
  return handleKill(job.data);
};


async function handleKill(killEvent) {

  const config = await SdtdConfig.findOne({ server: killEvent.server });
  console.log(config);
  if (!config.killEarnerEnabled) {
    return 'killEarner is disabled';
  }

  if (killEvent.zombiesKilled) {
    for (let index = 0; index < killEvent.zombiesKilled; index++) {
      await sails.helpers.economy.giveToPlayer.with({
        playerId: killEvent.id,
        amountToGive: config.zombieKillReward,
        message: `killEarner - Rewarding player for a zombie kill`
      });

    }
  }

  if (killEvent.playersKilled) {
    for (let index = 0; index < killEvent.playersKilled; index++) {
      await sails.helpers.economy.giveToPlayer.with({
        playerId: killEvent.id,
        amountToGive: config.playerKillReward,
        message: `killEarner - Rewarding player for a player kill`
      });

    }
  }
}
