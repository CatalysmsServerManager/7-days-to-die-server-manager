module.exports = {
  get: async function (serverId) {
    const lastLogLine = await sails.helpers.redis.get(
      `sdtdserver:${serverId}:sdtdLogs:lastLogLine`);
    return lastLogLine;
  },
  set: async function (serverId, lastLogLine) {
    await sails.helpers.redis.set(
      `sdtdserver:${serverId}:sdtdLogs:lastLogLine`,
      lastLogLine
    );
    return lastLogLine;
  },
};
