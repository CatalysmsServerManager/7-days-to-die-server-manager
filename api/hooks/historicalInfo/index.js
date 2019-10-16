var sevenDays = require('machinepack-7daystodiewebapi');
let MemUpdate = require('./objects/memUpdate');

module.exports = function historicalInfo(sails) {

  let memUpdateMap = new Map();

  return {
    initialize: function (cb) {
      sails.on('hook:sdtdlogs:loaded', async function () {
        sails.log.info('Initializing custom hook (`historicalInfo`)');
        let memUpdateEnabledServers = await SdtdConfig.find({
          memUpdateInfoEnabled: true,
          inactive: false,
        }).populate('server');
        for (let config of memUpdateEnabledServers) {
          await startMemUpdate(config.server);
        }
        return cb();


      });
    },

    start: async function (serverId, type) {

      switch (type) {
        case 'memUpdate':
          return startMemUpdate(serverId);
          break;

        default:
          throw new Error('Unknown updateObject type')
          break;
      }
    },

    stop: async function (serverId, type) {
      switch (type) {
        case 'memUpdate':
          return stopMemUpdate(serverId);
          break;

        default:
          throw new Error('Unknown updateObject type')
          break;
      }
    },

    getStatus: function (server, type) {
      switch (type) {
        case 'memUpdate':
          return memUpdateMap.has(String(server.id ? server.id : server))
          break;

        default:
          throw new Error('Unknown updateObject type')
          break;
      }
    }

  };


  async function startMemUpdate(serverId) {
    try {
      const server = await SdtdServer.findOne(serverId).populate('config');
      const config = server.config[0];
      let loggingObject = await sails.hooks.sdtdlogs.getLoggingObject(server.id);
      let memUpdateObject = new MemUpdate(server, config, loggingObject);
      await memUpdateObject.start();
      setMap(server, memUpdateObject);
      return true
    } catch (error) {
      sails.log.error(`HOOK - historicalInfo - Error starting memUpdate ${error}`)
      return false
    }
  }

  async function stopMemUpdate(serverId) {
    try {
      let memUpdateObject = getMap(serverId, 'memUpdate');
      memUpdateObject.stop();
      deleteMap(serverId, memUpdateObject);
    } catch (error) {
      sails.log.error(`HOOK - historicalInfo - Error stopping memUpdate ${error}`)
      return false
    }
  }





  function getMap(server, type) {
    switch (type) {
      case 'memUpdate':
        return memUpdateMap.get(String(server.id ? server.id : server), type)
        break;

      default:
        throw new Error('Unknown updateObject type')
        break;
    }
  }

  function setMap(server, updateObject) {
    switch (updateObject.type) {
      case 'memUpdate':
        return memUpdateMap.set(String(server.id ? server.id : server), updateObject);
        break;

      default:
        throw new Error('Must set a known type in updateObject')
        break;
    }
  }

  function deleteMap(server, updateObject) {
    switch (updateObject.type) {
      case 'memUpdate':
        return memUpdateMap.delete(String(server.id ? server.id : server), updateObject);
        break;

      default:
        throw new Error('Must set a known type in updateObject')
        break;
    }
  }

};
