module.exports = {
  get: async function (serverId) {
    const emptyResponses = await sails.helpers.redis.get(
      `sdtdserver:${serverId}:sdtdLogs:emptyResponses`);
    return emptyResponses;
  },
  set: async function (serverId, emptyResponses) {
    await sails.helpers.redis.set(
      `sdtdserver:${serverId}:sdtdLogs:emptyResponses`,
      emptyResponses
    );
    return emptyResponses;
  },
  incr: async function (serverId) {
    await sails.helpers.redis.incr(
      `sdtdserver:${serverId}:sdtdLogs:emptyResponses`);
  },
};
