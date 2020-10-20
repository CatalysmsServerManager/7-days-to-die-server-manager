module.exports = async function locationTracking(server, playerList, playersArray, playerRecords) {

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
};
