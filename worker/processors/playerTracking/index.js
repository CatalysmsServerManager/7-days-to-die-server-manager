const basic = require('./trackingFunctions/basic');
const location = require('./trackingFunctions/location');
const inventory = require('./trackingFunctions/inventory');


module.exports = async (job) => {
  sails.log.debug('[Worker] Got a `playerTracking` job', job.data);
  return doTracking(job.data);
};


async function doTracking(serverId) {
  let dateStarted = new Date();

  let server = await SdtdServer.findOne({ id: serverId }).populate('config');

  if (_.isUndefined(server)) {
    return sails.log.warn(`Player tracking - Could not find server info during tracking!`, { serverId });
  }

  let onlinePlayers = await sails.helpers.sdtd.getOnlinePlayers(server.id);

  if (!onlinePlayers) {
    sails.log.error(`Unexpected value for onlinePlayers: ${onlinePlayers}`);
    return;
  }

  if (!onlinePlayers.length) {
    return;
  }

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
    await basic(server, onlinePlayers, playerRecords);
  } catch (error) {
    sails.log.error(error);
  }

  if (server.config[0].locationTracking || server.config[0].inventoryTracking) {
    // If inventory OR location tracking is enabled, we prepare the tracking info beforehand to improve performance

    if (server.config[0].locationTracking) {

      try {
        initialValues = await location(server, onlinePlayers, initialValues, playerRecords);
      } catch (error) {
        sails.log.error(error);
      }
    }

    if (server.config[0].inventoryTracking) {

      try {
        initialValues = await inventory(server, onlinePlayers, initialValues, playerRecords);
      } catch (error) {
        sails.log.error(error);
      }
      await sails.helpers.getQueueObject('bannedItems').add({ server, trackingInfo: initialValues });
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

}


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
