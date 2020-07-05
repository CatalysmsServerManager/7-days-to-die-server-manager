const SdtdApi = require('7daystodie-api-wrapper');

/**
 * playerTracking hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function definePlayerTrackingHook(sails) {

  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: function (done) {

      sails.log.info('Initializing custom hook (`playerTracking`)');
      return done();

    },

    start(serverId) {

      let loggingObject = sails.hooks.sdtdlogs.getLoggingObject(serverId);

      if (_.isUndefined(loggingObject)) {
        sails.log.warn(`Tried to start tracking for a server without a loggingObject`, {
          server: serverId
        });
        return;
      }

      setInterval(async () => {
        let dateStarted = new Date();

        let server = await SdtdServer.findOne({ id: serverId }).populate('config');

        if (_.isUndefined(server)) {
          return sails.log.warn(`Player tracking - Could not find server info during tracking!`, { serverId });
        }

        let onlinePlayers = await sails.helpers.sdtd.getOnlinePlayers(server.id);


        let initialValues = new Array();

        let playerRecords = await Player.find({
          server: server.id,
          steamId: onlinePlayers.map(playerInfo => playerInfo.steamid)
        });

        for (const playerRecord of playerRecords) {

          initialValues.push({
            server: server.id,
            player: playerRecord.id
          });
        }

        try {
          await basicTracking(server, loggingObject, onlinePlayers, playerRecords);
        } catch (error) {
          sails.log.error(error);
        }

        if (server.config[0].locationTracking || server.config[0].inventoryTracking) {
          // If inventory OR location tracking is enabled, we prepare the tracking info beforehand to improve performance

          if (server.config[0].locationTracking) {

            try {
              initialValues = await locationTracking(server, loggingObject, onlinePlayers, initialValues, playerRecords);
            } catch (error) {
              sails.log.error(error);
            }
          }

          if (server.config[0].inventoryTracking) {

            try {
              initialValues = await inventoryTracking(server, loggingObject, onlinePlayers, initialValues, playerRecords);
            } catch (error) {
              sails.log.error(error);
            }
            loggingObject.emit('trackingUpdate', { server, trackingInfo: initialValues });
          }
          await TrackingInfo.createEach(initialValues);

        }

        let currentCycles = await sails.helpers.redis.get(`server:${serverId}:trackingCyclesCompleted`);
        currentCycles = parseInt(currentCycles);

        if (!currentCycles) {
          currentCycles = 1;
        }

        if (currentCycles >= sails.config.custom.trackingCyclesBeforeDelete) {
          await deleteLocationData(server);
          await sails.helpers.redis.set(`server:${serverId}:trackingCyclesCompleted`, 0);
        } else {
          await sails.helpers.redis.incr(`server:${serverId}:trackingCyclesCompleted`);
        }

        let dateEnded = new Date();
        sails.log.debug(`Player tracking - Performed tracking for server ${server.name} - ${playerRecords.length} players online - ${currentCycles}/${sails.config.custom.trackingCyclesBeforeDelete} tracking cycles - took ${dateEnded.valueOf() - dateStarted.valueOf()} ms`);

      }, 30000 + Math.floor(Math.random() * 1000) - 500);



    },

  };


  async function basicTracking(server, loggingObject, onlinePlayers, playerRecords) {

    let dateStarted = new Date();

    for (const playerStats of onlinePlayers) {
      if (playerStats.steamid) {
        // Load the current player data
        let player = playerRecords.filter(playerInfo => playerInfo.steamId === playerStats.steamid);

        let statsUpdate = {
          zombieKills: playerStats.zombiekills,
          playerKills: playerStats.playerkills,
          ip: playerStats.ip,
          deaths: playerStats.playerdeaths,
          score: playerStats.score,
          level: Math.trunc(playerStats.level)
        };
        // Update with the new data
        player = player[0];

        if (_.isUndefined(player)) {
          return;
        }

        await Player.update(player.id, statsUpdate);


        // Detect if player killed any zombies
        if (player.zombieKills < playerStats.zombiekills && player.zombieKills !== 0) {
          let zombiesKilled = playerStats.zombiekills - player.zombieKills;
          sails.log.debug(`Detected a zombie kill! ${player.name} of server ${server.name} has killed ${playerStats.zombiekills} zombies in total. - Detected ${zombiesKilled} kills`);
          player.zombiesKilled = zombiesKilled;
          loggingObject.emit('zombieKill', player);
        }

        // Detect if player killed any players
        if (player.playerKills < playerStats.playerkills && player.playerKills !== 0) {
          let playersKilled = playerStats.playerkills - player.playerKills;
          sails.log.debug(`Detected a player kill! ${player.name} of server ${server.name} has killed ${playerStats.playerkills} players in total. - Detected ${playersKilled} kills`);
          player.playersKilled = playersKilled;
          loggingObject.emit('playerKill', player);
        }

        // Detect if player leveled up
        if (player.level < Math.trunc(playerStats.level) && player.level !== 0) {
          let levels = Math.trunc(playerStats.level) - player.level;
          sails.log.debug(`Detected a level up! ${player.name} of server ${server.name} has leveled up to ${Math.trunc(playerStats.level)}. - Detected ${levels} levels`);
          player.levels = levels;
          loggingObject.emit('levelup', player);
        }

        // Detect if player gained score
        if (player.score < playerStats.score && player.score !== 0) {
          let scoreGained = playerStats.score - player.score;
          player.scoreGained = scoreGained;
          loggingObject.emit('score', player);
        }
      }
    }

    let dateEnded = new Date();
    sails.log.verbose(`Performed basicTracking for server ${server.name} - ${playerRecords.length} players online - took ${dateEnded.valueOf() - dateStarted.valueOf()} ms`);

    return;
  }

  async function locationTracking(server, loggingObject, playerList, playersArray, playerRecords) {

    let dateStarted = new Date();

    for (const onlinePlayer of playerList) {
      let playerRecord = playerRecords.filter(player => onlinePlayer.steamid === player.steamId);
      if (playerRecord.length === 1) {
        let trackingRecord = playersArray.filter(record => record.player === playerRecord[0].id);
        let trackingRecordIdx = playersArray.indexOf(trackingRecord[0]);

        if (trackingRecord.length === 1) {
          trackingRecord[0].x = onlinePlayer.position.x;
          trackingRecord[0].y = onlinePlayer.position.y;
          trackingRecord[0].z = onlinePlayer.position.z;

          playersArray[trackingRecordIdx] = trackingRecord[0];

        }
      }

    }

    let dateEnded = new Date();
    sails.log.verbose(`Performed locationTracking for server ${server.name} - ${playerRecords.length} players online - took ${dateEnded.valueOf() - dateStarted.valueOf()} ms`);
    return playersArray;
  }


  async function inventoryTracking(server, loggingObject, playerList, playersArray, playerRecords) {
    let dateStarted = new Date();
    let inventories = new Array();
    try {
      inventories = await SdtdApi.getPlayerInventories({
        ip: server.ip,
        port: server.webPort,
        adminUser: server.authName,
        adminToken: server.authToken,
      });
    } catch (error) {

      sails.log.warn(`${server.name} Errored during inventory tracking - ${error}.`);
    }


    for (const onlinePlayer of playerList) {
      let playerRecord = playerRecords.filter(player => onlinePlayer.steamid === player.steamId);
      if (playerRecord.length === 1) {

        let trackingRecord = playersArray.filter(record => record.player === playerRecord[0].id);
        let trackingRecordIdx = playersArray.indexOf(trackingRecord[0]);

        if (trackingRecord.length === 1) {
          let inventory = inventories.filter(inventoryEntry => inventoryEntry.steamid === playerRecord[0].steamId);
          if (inventory.length === 1) {
            let itemsInInventory = new Array();
            inventory = inventory[0];

            inventory.bag = _.filter(inventory.bag, (value) => !_.isNull(value));
            inventory.belt = _.filter(inventory.belt, (value) => !_.isNull(value));
            inventory.equipment = _.filter(inventory.equipment, (value) => !_.isNull(value));

            for (const inventoryItem of inventory.bag) {
              itemsInInventory.push(_.omit(inventoryItem, 'iconcolor', 'qualitycolor', 'icon'));
            }

            for (const inventoryItem of inventory.belt) {
              itemsInInventory.push(_.omit(inventoryItem, 'iconcolor', 'qualitycolor', 'icon'));
            }

            for (const inventoryItem of inventory.equipment) {
              itemsInInventory.push(_.omit(inventoryItem, 'iconcolor', 'qualitycolor', 'icon'));
            }

            trackingRecord[0].inventory = itemsInInventory;
            playersArray[trackingRecordIdx] = trackingRecord[0];


          }

        }

      }

    }

    let dateEnded = new Date();
    sails.log.verbose(`Performed inventory tracking for ${server.name} - ${playerList.length} players, took ${dateEnded.valueOf() - dateStarted.valueOf()} ms`);
    return playersArray;
  }

};

async function deleteLocationData(server) {
  let dateNow = Date.now();
  let deleteResult;
  try {
    let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({
      serverId: server.id
    });
    let hoursToKeepData = sails.config.custom.donorConfig[donatorRole].playerTrackerKeepLocationHours;
    let milisecondsToKeepData = hoursToKeepData * 3600000;
    let borderDate = new Date(dateNow.valueOf() - milisecondsToKeepData);

    const locationDeleteSQL = `DELETE FROM trackinginfo WHERE server = ${server.id} AND createdAt < ${borderDate.valueOf()};`;

    deleteResult = await sails.sendNativeQuery(locationDeleteSQL);

  } catch (error) {
    sails.log.error(error);
  }

  let dateEnded = new Date();
  sails.log.verbose(`Deleted location data for server ${server.name} - deleted ${deleteResult.affectedRows} rows - took ${dateEnded.valueOf() - dateNow.valueOf()} ms`);
}
