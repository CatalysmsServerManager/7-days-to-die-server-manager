const PlaytimeEarner = require('./objects/playtimeEarner');
const DiscordTextEarner = require('./objects/discordTextEarner');
const KillEarner = require('./objects/killEarner');
const DiscordMessageHandler = require('./objects/discordMessageHandler');

let playtimeEarnerMap = new Map();
let discordTextEarnerMap = new Map();
let killEarnerMap = new Map();
let discordMessageEmitter;

module.exports = function economy(sails) {


  return {
    initialize: function (cb) {

      sails.on('hook:sdtdlogs:loaded', async function () {
        sails.log.info('Initializing custom hook (`economy`)');
        // eslint-disable-next-line callback-return
        cb();

        discordMessageEmitter = new DiscordMessageHandler();

        let economyEnabledServers = await SdtdConfig.find({
          economyEnabled: true,
          inactive: false,
        });

        sails.log.info(`HOOK: economy - Initializing ${economyEnabledServers.length} servers`);
        for (let config of economyEnabledServers) {

          if (config.playtimeEarnerEnabled) {
            await startPlaytimeEarner(config.server);
          }

          if (config.discordTextEarnerEnabled) {
            await startDiscordTextEarner(config.server);
          }

          if (config.killEarnerEnabled) {
            await startKillEarner(config.server);
          }
        }

        return;
      });
    },

    start: async function (serverId, type) {

      switch (type) {
        case 'playtimeEarner':
          return startPlaytimeEarner(serverId);
          break;
        case 'discordTextEarner':
          return startDiscordTextEarner(serverId);
          break;
        case 'killEarner':
          return startKillEarner(serverId);
          break;

        default:
          throw new Error('Unknown updateObject type');
          break;
      }
    },

    stop: async function (serverId, type) {
      switch (type) {
        case 'playtimeEarner':
          return stopPlaytimeEarner(serverId);
          break;
        case 'discordTextEarner':
          return stopDiscordTextEarner(serverId);
          break;
        case 'killEarner':
          return stopKillEarner(serverId);
          break;
        default:
          throw new Error('Unknown updateObject type');
          break;
      }
    },

    getStatus: function (server, type) {
      switch (type) {
        case 'playtimeEarner':
          return playtimeEarnerMap.has(String(server.id ? server.id : server));
          break;
        case 'discordTextEarner':
          return discordTextEarnerMap.has(String(server.id ? server.id : server));
          break;
        case 'killEarner':
          return killEarnerMap.has(String(server.id ? server.id : server));
          break;

        default:
          throw new Error('Unknown updateObject type');
          break;
      }
    },

    reload: async function (serverId, type) {
      let config = await SdtdConfig.findOne({
        server: serverId
      });
      switch (type) {
        case 'playtimeEarner':
          if (config.playtimeEarnerEnabled) {
            await stopPlaytimeEarner(serverId);
            return await startPlaytimeEarner(serverId);
          } else {
            await startPlaytimeEarner(serverId);
            return await stopPlaytimeEarner(serverId);
          }
          break;
        case 'discordTextEarner':
          if (config.discordTextEarnerEnabled) {
            await stopDiscordTextEarner(serverId);
            return await startDiscordTextEarner(serverId);
          } else {
            await startDiscordTextEarner(serverId);
            return await stopDiscordTextEarner(serverId);
          }
          break;

        case 'killEarner':
          if (config.killEarnerEnabled) {
            await stopKillEarner(serverId);
            return await startKillEarner(serverId);
          } else {
            await startKillEarner(serverId);
            return await stopKillEarner(serverId);
          }
          break;

        default:
          throw new Error('Unknown updateObject type');
          break;
      }
    },

  };
};

async function startKillEarner(serverId) {
  try {
    if (getMap(serverId, 'killEarner')) {
      return;
    }

    const server = await SdtdServer.findOne(serverId).populate('config');
    const config = server.config[0];
    let loggingObject = await sails.hooks.sdtdlogs.getLoggingObject(server.id);
    let killEarnerObject = new KillEarner(server, config, loggingObject);
    await killEarnerObject.start();
    setMap(server.id, killEarnerObject);
    return true;
  } catch (error) {
    sails.log.error(`HOOK - economy - Error starting killEarner ${error}`, {serverId});
    return false;
  }
}

async function stopKillEarner(serverId) {
  try {
    if (!getMap(serverId, 'killEarner')) {
      return;
    }

    let killEarnerObject = await getMap(serverId, 'killEarner');
    killEarnerObject.stop();
    deleteMap(serverId, killEarnerObject);
    return true;
  } catch (error) {
    sails.log.error(`HOOK - economy - Error stopping killEarner ${error}`, {serverId});
  }
}


async function startPlaytimeEarner(serverId) {
  try {
    if (getMap(serverId, 'playtimeEarner')) {
      return;
    }

    const server = await SdtdServer.findOne(serverId).populate('config');
    const config = server.config[0];
    let playtimeEarnerObject = new PlaytimeEarner(server, config);
    await playtimeEarnerObject.start();
    setMap(server.id, playtimeEarnerObject);
    return true;
  } catch (error) {
    sails.log.error(`HOOK - economy - Error starting playtimeEarner ${error}`, {serverId});
    return false;
  }
}


async function stopPlaytimeEarner(serverId) {
  try {
    if (!getMap(serverId, 'playtimeEarner')) {
      return;
    }

    let playtimeEarnerObject = await getMap(serverId, 'playtimeEarner');
    playtimeEarnerObject.stop();
    deleteMap(serverId, playtimeEarnerObject);
  } catch (error) {
    sails.log.error(`HOOK - economy - Error stopping playtimeEarner ${error}`, {serverId});
  }
}

async function startDiscordTextEarner(serverId) {
  try {
    if (getMap(serverId, 'discordTextEarner')) {
      return;
    }

    const server = await SdtdServer.findOne(serverId).populate('config');
    const config = server.config[0];
    const messageEmitter = discordMessageEmitter.getEmitter();

    let discordTextEarnerObject = new DiscordTextEarner(server, config, messageEmitter);
    await discordTextEarnerObject.start();
    setMap(server.id, discordTextEarnerObject);
    return true;
  } catch (error) {
    sails.log.error(`HOOK - economy - Error starting discordTextEarner ${error}`, {serverId});
    return false;
  }
}

async function stopDiscordTextEarner(serverId) {
  try {

    if (!getMap(serverId, 'discordTextEarner')) {
      return;
    }

    let discordTextEarnerObject = await getMap(serverId, 'discordTextEarner');
    discordTextEarnerObject.stop();
    deleteMap(serverId, discordTextEarnerObject);
  } catch (error) {
    sails.log.error(`HOOK - economy - Error stopping discordTextEarner ${error}`, {serverId});
  }
}


function getMap(server, type) {
  switch (type) {
    case 'playtimeEarner':
      return playtimeEarnerMap.get(String(server.id ? server.id : server));
      break;
    case 'discordTextEarner':
      return discordTextEarnerMap.get(String(server.id ? server.id : server));
      break;
    case 'killEarner':
      return killEarnerMap.get(String(server.id ? server.id : server));
      break;

    default:
      throw new Error('Unknown updateObject type');
      break;
  }
}

function setMap(server, updateObject) {
  switch (updateObject.type) {
    case 'playtimeEarner':
      return playtimeEarnerMap.set(String(server.id ? server.id : server), updateObject);
      break;
    case 'discordTextEarner':
      return discordTextEarnerMap.set(String(server.id ? server.id : server), updateObject);
      break;
    case 'killEarner':
      return killEarnerMap.set(String(server.id ? server.id : server), updateObject);
      break;
    default:
      throw new Error('Must set a known type in updateObject');
      break;
  }
}

function deleteMap(server, updateObject) {
  switch (updateObject.type) {
    case 'playtimeEarner':
      return playtimeEarnerMap.delete(String(server.id ? server.id : server));
      break;
    case 'discordTextEarner':
      return discordTextEarnerMap.delete(String(server.id ? server.id : server));
      break;
    case 'killEarner':
      return killEarnerMap.delete(String(server.id ? server.id : server));
      break;
    default:
      throw new Error('Must set a known type in updateObject');
      break;
  }
}
