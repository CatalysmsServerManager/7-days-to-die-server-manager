module.exports = async function kill(job) {
  sails.log.debug('[Worker] Got a `kill` job');
  return handleKill(job.data);
};

const KILL_TYPE = {
  zombie: 'zombie',
  player: 'player',
};

const giveKillRewards = (killCount, playerId, amountToGive, killType) => {
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

  const promisesForZombieKill = giveKillRewards(
    killEvent.zombiesKilled,
    killEvent.id,
    config.zombieKillReward,
    KILL_TYPE.zombie
  );

  const promisesForPlayerKill = giveKillRewards(
    killEvent.playersKilled,
    killEvent.id,
    config.playerKillReward,
    KILL_TYPE.player
  );

  await Promise.all([...promisesForZombieKill, ...promisesForPlayerKill]);
}
