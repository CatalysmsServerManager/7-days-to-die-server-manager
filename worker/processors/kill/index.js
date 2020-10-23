module.exports = async (job) => {
  sails.log.debug('[Worker] Got a `kill` job', job.data);
  return handleKill(job.data);
};

const KILL_TYPE = {
  zombie: 'zombie',
  player: 'player',
};

const giveRewardsToPlayerForKill = (killCount, playerId, amountToGive, killType) => {
  const promises = [];
  for (let index = 0; index < killCount; index++) {
    promises.push(
      sails.helpers.economy.giveToPlayer.with({
        playerId,
        amountToGive,
        message: `killEarner - Rewarding player for a ${killType} kill`
      })
    );
  }
  return promises;
};

async function handleKill(killEvent) {

  const config = await SdtdConfig.findOne({ server: killEvent.server });
  if (!config.killEarnerEnabled) {
    return 'killEarner is disabled';
  }

  if (killEvent.zombiesKilled) {
    Promise.all(giveRewardsToPlayerForKill(
      killEvent.zombiesKilled,
      killEvent.id,
      config.zombieKillReward,
      KILL_TYPE.zombie)
    ).catch((err) => sails.log.error(err));
  }

  if (killEvent.playersKilled) {
    Promise.all(giveRewardsToPlayerForKill(
      killEvent.playersKilled,
      killEvent.id,
      config.playerKillReward,
      KILL_TYPE.player)
    ).catch((err) => sails.log.error(err));
  }
}
