const { Error } = require('sequelize');

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

  generateNativeQuery(server, sortBy, sortDirection, limit) {
    let sortingSegment = ``;

    if (sortBy && sortDirection) {
      if (sortBy === 'name' || sortBy === 'value') {
        sortingSegment = `ORDER BY LENGTH(${sortBy}) ${sortDirection}, ${sortBy} ${sortDirection}`;
      } else {
        sortingSegment = `ORDER BY ${sortBy} ${sortDirection}`;
      }
    }

    let limitSegment = ``;

    if (limit !== -1){
      limitSegment = `LIMIT ${limit}`;
    }

    const sqlQuery = `
    SELECT *
    FROM ${PersistentVariable.tableName}
    WHERE
      server = ${server.id}
      AND name LIKE $1
    ${sortingSegment}
    ${limitSegment}
    `;

    return sqlQuery;
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

  async set(server, name, value, preventDeletion) {
    if (!server || !server.id) {
      throw new Error('`server` must be provided');
    }

    value = JSON.stringify(value);

    return this.queue.push(async () => {
      await PersistentVariable.findOrCreate(this.getDefaultQueryFilter(server, name), { ...this.getDefaultQueryFilter(server, name), value, preventDeletion });
      await PersistentVariable.updateOne(this.getDefaultQueryFilter(server, name), { value, preventDeletion });
      sails.log.debug(`PersistentVariable.set("${name}")`, this.getLogMeta(server));
      return value;
    });
  }

  async list(server, query, sortBy, sortDirection, limit) {
    if (!server || !server.id) {
      throw new Error('`server` must be provided');
    }

    if (typeof query !== 'string') {
      throw new Error('Invalid argument `query`');
    }

    const sortByOptions = {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      name: 'name',
      value: 'value',
      preventDeletion: 'preventDeletion'
    };

    const sortDirectionOptions = {
      ASC: 'ASC',
      DESC: 'DESC',
      asc: 'ASC',
      desc: 'DESC'
    };

    if (sortBy && !sortByOptions[sortBy]){
      throw new Error('Invalid argument `sortBy`');
    }

    if (sortDirection && !sortDirectionOptions[sortDirection]){
      throw new Error('Invalid argument `sortDirection`');
    }

    if (typeof limit !== 'number') {
      throw new Error('Invalid argument `limit`');
    }

    const nativeQuery = this.generateNativeQuery(server, sortBy, sortDirection, limit);

    if (query !== '*' && query.startsWith('*') && query.endsWith('*')) {
      query = `%${query.substring(1, query.length - 1)}%`;
    }
    else if (query !== '*' && query.startsWith('*')) {
      query = `%${query.substring(1, query.length)}`;
    }
    else if (query !== '*' && query.endsWith('*')) {
      query = `${query.substring(0, query.length - 1)}%`;
    }
    else if (!query.includes('*') && query) {
      query = `%${query}%`;
    }
    else if (!query || query === '*') {
      query = `%%`;
    }

    return this.queue.push(async () => {
      const rawResult = await sails.sendNativeQuery(nativeQuery, [query]);

      const variables = rawResult.rows.flat();

      sails.log.debug(`PersistentVariable.list("${query}", "${sortBy}", "${sortDirection}", "${limit === -1 ? 'none' : limit}")`, this.getLogMeta(server));

      if (!variables) {
        return [];
      }

      return variables;
    });
  }

  async del(server, name) {
    if (!server || !server.id) {
      throw new Error('`server` must be provided');
    }

    return this.queue.push(async () => {
      const variable = await PersistentVariable.findOne(this.getDefaultQueryFilter(server, name));

      if (variable && variable.preventDeletion) {
        throw new Error('variable must be unlocked before it can be deleted');
      }

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
