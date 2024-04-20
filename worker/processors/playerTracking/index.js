const trackingFunctions = require('./trackingFunctions');

module.exports = async function playerTracking(job) {
  sails.log.debug('[Worker] Got a `playerTracking` job', {
    serverId: job.data.serverId,
  });
  return doTracking(job.data);
};

async function doTracking(serverId) {
  let dateStarted = new Date();

  let server = await SdtdServer.findOne({ id: serverId }).populate('config');

  if (_.isUndefined(server)) {
    return sails.log.warn(
      `Player tracking - Could not find server info during tracking!`,
      { serverId }
    );
  }

  let onlinePlayers = await sails.helpers.sdtd.getOnlinePlayers(server.id);

  if (!onlinePlayers) {
    sails.log.error(`Unexpected value for onlinePlayers: ${onlinePlayers}`, {
      serverId,
    });
    return;
  }

  if (!onlinePlayers.length) {
    return;
  }

  let initialValues = new Array();

  let playerRecords = await Player.find({
    server: server.id,
    steamId: onlinePlayers.map((playerInfo) => playerInfo.steamid),
  });

  for (const playerRecord of playerRecords) {
    initialValues.push({
      server: server.id,
      player: playerRecord.id,
    });
  }

  await trackingFunctions.basic(server, onlinePlayers, playerRecords);

  if (server.config[0].locationTracking || server.config[0].inventoryTracking) {
    // If inventory OR location tracking is enabled, we prepare the tracking info beforehand to improve performance

    if (server.config[0].locationTracking) {
      initialValues = await trackingFunctions.location(
        server,
        onlinePlayers,
        initialValues,
        playerRecords
      );
    }

    if (server.config[0].inventoryTracking) {
      initialValues = await trackingFunctions.inventory(
        server,
        onlinePlayers,
        initialValues,
        playerRecords
      );

      await sails.helpers
        .getQueueObject('bannedItems')
        .add({ server, trackingInfo: initialValues });
    }
    await TrackingInfo.createEach(initialValues);
  }

  let dateEnded = new Date();
  sails.log.debug(
    `Player tracking - Performed tracking for server ${server.name} - ${
      playerRecords.length
    } players online - took ${dateEnded.valueOf() - dateStarted.valueOf()} ms`,
    { server }
  );
}
