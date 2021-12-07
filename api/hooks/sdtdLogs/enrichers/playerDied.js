module.exports = async (event) => {
  if (
    event.type !== 'playerDied' &&
    event.type !== 'playerKilled' &&
    event.type !== 'playerSuicide'
  ) { return event; }

  if (!event.data.player) { throw new Error('Cannot store last death location when no player defined'); }

  const onlinePlayers = await  sails.helpers.sdtdApi.getOnlinePlayers(SdtdServer.getAPIConfig(event.server));

  const player = onlinePlayers.find(p => p.steamid === event.data.player.steamId);

  const updatedPlayers = await Player.update(
    { id: event.data.player.id },
    {
      lastDeathLocationX: player.position.x,
      lastDeathLocationY: player.position.y,
      lastDeathLocationZ: player.position.z,
    }).fetch();

  if (!updatedPlayers[0]) {
    throw new Error('Player not found? Shouldnt happen, watcha doin mate..');
  }

  event.data.player = updatedPlayers[0];
  sails.log.debug(`Updated player ${event.data.player.id} last death location to ${event.data.player.positionX},${event.data.player.positionY},${event.data.player.positionZ}`, {playerId: event.data.player.id, server:event.data.server});


  return event;
};
