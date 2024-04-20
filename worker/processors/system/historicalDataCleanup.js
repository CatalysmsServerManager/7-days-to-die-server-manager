module.exports = async function historicalDataCleanup() {
  const serversPerPage = 10;
  const serverCount = await SdtdServer.count();

  for (let i = 0; i < serverCount / serversPerPage; i++) {
    const serversToCheck = await SdtdServer.find({
      skip: serversPerPage * i,
      limit: serversPerPage,
      where: {
        disabled: false,
      },
    });

    for (const server of serversToCheck) {
      try {
        await sails.helpers.economy.deleteOldData(server.id);
        await cleanUpMemUpdate(server.id);
        await cleanUpLocationData(server.id);
      } catch (error) {
        sails.log.error(error, { server });
        continue;
      }
    }
  }
};

async function cleanUpMemUpdate(serverId) {
  let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({
    serverId,
  });
  let hoursToKeepData =
    sails.config.custom.donorConfig[donatorRole].memUpdateKeepDataHours;
  let milisecondsToKeepData = hoursToKeepData * 3600000;
  let dateNow = Date.now();
  let borderDate = new Date(dateNow.valueOf() - milisecondsToKeepData);

  await sails.sendNativeQuery(
    `DELETE FROM analytics WHERE server = $1 AND createdAt < $2;`,
    [serverId, borderDate.valueOf()]
  );

  let dateEnded = Date.now();

  sails.log.debug(
    `Deleted historical data of type memUpdate for server ${serverId} - took ${
      dateEnded - dateNow
    } ms`,
    { server: serverId }
  );
}

async function cleanUpLocationData(serverId) {
  let deleteResult;
  let dateNow = Date.now();

  let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({
    serverId,
  });

  let hoursToKeepData =
    sails.config.custom.donorConfig[donatorRole].playerTrackerKeepLocationHours;
  let milisecondsToKeepData = hoursToKeepData * 3600000;
  let borderDate = new Date(dateNow.valueOf() - milisecondsToKeepData);

  const locationDeleteSQL = `DELETE FROM trackinginfo WHERE server = $1 AND createdAt < $2;`;

  deleteResult = await sails.sendNativeQuery(locationDeleteSQL, [
    serverId,
    borderDate.valueOf(),
  ]);

  let dateEnded = new Date();
  sails.log.debug(
    `Deleted location data for server ${serverId} - deleted ${
      deleteResult.affectedRows
    } rows - took ${dateEnded.valueOf() - dateNow.valueOf()} ms`,
    { server: serverId }
  );
}
