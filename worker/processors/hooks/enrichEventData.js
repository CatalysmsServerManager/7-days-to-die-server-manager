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

  if (!_.isEmpty(event.crossId)) {
    player = await Player.findOne({
      crossId: event.crossId,
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

