module.exports = {
  get: async function (serverId) {
    const failedCounter = await sails.helpers.redis.get(
      `sdtdserver:${serverId}:sdtdLogs:failedCounter`);
    return failedCounter;
  },
  set: async function (serverId, failedCounter) {
    await sails.helpers.redis.set(
      `sdtdserver:${serverId}:sdtdLogs:failedCounter`,
      failedCounter
    );
    return failedCounter;
  },
  incr: async function (serverId) {
    await sails.helpers.redis.incr(
      `sdtdserver:${serverId}:sdtdLogs:failedCounter`);
  },
};
