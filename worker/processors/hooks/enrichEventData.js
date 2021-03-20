const steam64Regex = new RegExp('[0-9]{17}');

module.exports = async function enrichEventData(event) {
  let newData = event;

  switch (event.type) {
    case 'playerKilled':
      newData.victim = await Player.findOne({
        server: event.server.id,
        name: event.victimName
      });
      newData.killer = await Player.findOne({
        server: event.server.id,
        name: event.killerName
      });
      break;
    default:
      break;
  }

  if (!_.isEmpty(newData.playerID)) {
    newData.steamId = newData.playerID;
  }

  let player;

  // Try to find a steamID64 in the log message that we can link to a player.
  let possibleIds = findSteamIdFromString(newData.msg);
  if (possibleIds.length === 1) {
    let players = await Player.find({
      server: event.server.id,
      steamId: possibleIds[0]
    });
    player = players[0];
  }

  if (!_.isEmpty(event.steamId)) {
    player = await Player.findOne({
      steamId: event.steamId,
      server: event.server.id
    });
  }

  if (!_.isEmpty(event.steamID)) {
    player = await Player.findOne({
      steamId: event.steamID,
      server: event.server.id
    });
  }

  // If we do not find the player via steamId, we try via name.
  if (_.isUndefined(player)) {
    if (!_.isEmpty(event.playerName)) {
      player = await Player.findOne({
        name: event.playerName,
        server: event.server.id
      });
    }
  }

  if (player) {
    newData.player = (await sails.helpers.sdtd.loadPlayerData.with({
      serverId: event.server.id,
      steamId: player.steamId
    }))[0];
  }

  return newData;

};

/**
 * @param {String} logLineMessage
 * @returns {Array} An array of strings that matches the steam64 regex
 */
function findSteamIdFromString(logLineMessage) {
  let possibleIds = steam64Regex.exec(logLineMessage);

  if (!_.isArray(possibleIds)) {
    possibleIds = [];
  }

  return possibleIds;
}
