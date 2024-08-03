const { promisify } = require("util");
/**
 * 7d2d servers send tons of logs lines. if we fetch the configured hooks from DB for each log line, it will be a performance hit.
 * So, we cache the hooks for each server in redis.
 * Each server gets a distinct key in redis which is a hash.
 * Each hash key is a type of hook (logLine, playerJoined etc) and the value is the array of hooks.
 */

module.exports = {
  getKey(serverId) {
    return `sdtdserver:${serverId}:hooksCache`;
  },
  async get(serverId, type) {
    const client = sails.hooks.redis.client;

    const hget = promisify(client.hget).bind(client);
    const hset = promisify(client.hset).bind(client);
    const expire = promisify(client.expire).bind(client);

    const key = this.getKey(serverId);

    let hooks = JSON.parse(await hget(key, type));

    if (!hooks) {
      let hooksFromDb = await CustomHook.find({
        server: serverId,
        event: type,
      });

      if (!hooksFromDb) {
        hooksFromDb = [];
      }

      await hset(key, type, JSON.stringify(hooksFromDb));
      await expire(key, 60 * 30, "NX"); // 30 minutes
      return hooksFromDb;
    }

    return hooks;
  },
  // Whenever hook config changes, should delete the entire cache and let it rebuild
  async reset(serverId) {
    const client = sails.hooks.redis.client;
    const key = this.getKey(serverId);
    const del = promisify(client.del).bind(client);
    await del(key);
  },
};
