const steamIdRegex = /\d{17}/g;
const crossIdRegex = /EOS_[\d\w]{32}/;

module.exports = async (event) => {
  let player;

  if (!_.isEmpty(event.playerID)) {
    event.steamId = event.playerID;
  }

  if (!_.isEmpty(event.steamId)) {
    player = await sails.helpers.sdtd.loadPlayerData.with({
      serverId: event.server.id,
      steamId: event.steamId
    });
    player = player[0];
  }

  if (!_.isEmpty(event.crossId)) {
    // TODO: Replace this with a loadPlayerData call when Allocs API is updated to send it...
    player = await Player.findOne({
      server: event.server.id,
      crossId: event.crossId
    });
  }

  if (!_.isEmpty(event.steamID)) {
    player = await sails.helpers.sdtd.loadPlayerData.with({
      serverId: event.server.id,
      steamId: event.steamID
    });
    player = player[0];
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

  // If at this point we still haven't found the player,
  // We check if there is a 'msg' from the log line and try to extract an ID
  if (_.isUndefined(player)) {
    if (event.msg) {
      const detectedSteamIdMatch = event.msg.match(steamIdRegex);
      const detectedCrossIdMatch = event.msg.match(crossIdRegex);

      if (detectedSteamIdMatch) {
        const steamId = detectedSteamIdMatch[0];
        player = await Player.findOne({ steamId });
      }

      if (detectedCrossIdMatch) {
        const crossId = detectedCrossIdMatch[0];
        player = await Player.findOne({ crossId });
      }
    }
  }


  if (player) {
    player.role = await sails.helpers.sdtd.getPlayerRole(player.id);
  }

  event.player = player;
  return event;
};
