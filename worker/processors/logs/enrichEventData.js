async function enrichEventData(event) {

  switch (event.type) {
    case 'playerKilled':
      event.data.victim = await Player.findOne({
        server: event.server.id,
        name: event.data.victimName
      });
      event.data.killer = await Player.findOne({
        server: event.server.id,
        name: event.data.killerName
      });
      event.data.victim.role = await sails.helpers.sdtd.getPlayerRole(event.data.victim.id);
      event.data.killer.role = await sails.helpers.sdtd.getPlayerRole(event.data.killer.id);

      break;
    default:
      break;
  }

  if (!_.isEmpty(event.data.playerID)) {
    event.data.steamId = event.data.playerID;
  }

  let player;

  if (!_.isEmpty(event.data.steamId)) {
    player = await sails.helpers.sdtd.loadPlayerData.with({
      serverId: event.server.id,
      steamId: event.data.steamId
    });
    player = player[0];
  }

  if (!_.isEmpty(event.data.steamID)) {
    player = await sails.helpers.sdtd.loadPlayerData.with({
      serverId: event.server.id,
      steamId: event.data.steamID
    });
    player = player[0];
  }

  // If we do not find the player via steamId, we try via name.
  if (_.isUndefined(player)) {
    if (!_.isEmpty(event.data.playerName)) {

      player = await Player.findOne({
        name: event.data.playerName,
        server: event.server.id
      });
    }
  }

  if (player) {
    player.role = await sails.helpers.sdtd.getPlayerRole(player.id);
  }

  event.data.player = player;
  return event;
};

module.exports = {
  enrichEventData
};
