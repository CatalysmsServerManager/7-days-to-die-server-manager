
class PersistentVariablesManager {
  constructor() {
    this.queue = new PromiseQueue();
  }

  getLogMeta(server) {
    return { labels: { namespace: 'persistentVariables', serverId: server.id } };
  }

  getDefaultQueryFilter(server, name) {
    return { server: server.id, name };
  }



  async get(server, name) {
    if (!server || !server.id) {
      throw new Error('`server` must be provided');
    }

    return this.queue.push(async () => {
      const variable = await PersistentVariable.findOne(this.getDefaultQueryFilter(server, name));

      sails.log.debug(`PersistentVariable.get("${name}")`, this.getLogMeta(server));

      if (!variable) {
        return null;
      }

      return JSON.parse(variable.value);
    });
  }

  async set(server, name, value) {
    if (!server || !server.id) {
      throw new Error('`server` must be provided');
    }

    value = JSON.stringify(value);

    return this.queue.push(async () => {
      await PersistentVariable.findOrCreate(this.getDefaultQueryFilter(server, name), { ...this.getDefaultQueryFilter(server, name), value });
      await PersistentVariable.updateOne(this.getDefaultQueryFilter(server, name), { value });
      sails.log.debug(`PersistentVariable.set("${name}")`, this.getLogMeta(server));
      return value;
    });



  }

  async del(server, name) {
    if (!server || !server.id) {
      throw new Error('`server` must be provided');
    }

    return this.queue.push(async () => {
      await PersistentVariable.destroyOne(this.getDefaultQueryFilter(server, name));
      sails.log.debug(`PersistentVariable.del("${name}")`, this.getLogMeta(server));
    });
  }

}

class PromiseQueue {
  constructor() {
    this.queue = [];
    this.isRunning = false;
  }

  push(promise) {
    return new Promise((resolve, reject) => {
      this.queue.push({ promise, resolve, reject });
      this.run();
    });
  }

  run() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    const item = this.queue.shift();

    if (!item) {
      this.isRunning = false;
      return;
    }

    item.promise().then(item.resolve).catch(item.reject).finally(() => {
      this.isRunning = false;
      this.run();
    });
  }
}

module.exports = new PersistentVariablesManager();
