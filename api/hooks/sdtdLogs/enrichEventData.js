module.exports = async function enrichEventData(event) {
    sails.log.debug(event)
  let newData = event.data;

  switch (event.type) {
    case 'playerKill':
      newData.victim = await Player.findOne({
        server: event.server.id,
        name: event.data.victimName
      });
      newData.killer = await Player.findOne({
        server: event.server.id,
        name: event.data.killerName
      });
      break;
    default:
      break;
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
        server: server.id
      });
    }
  }
  newData.player = player;



  return newData;

};
