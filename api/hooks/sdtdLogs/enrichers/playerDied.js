module.exports = async (event) => {
  if (
    event.type !== 'playerDied' &&
    event.type !== 'playerKilled' &&
    event.type !== 'playerSuicide'
  ) { return event; }

  if (!event.player) { throw new Error('Cannot store last death location when no player defined'); }

  const onlinePlayers = await sails.helpers.sdtdApi.getOnlinePlayers(SdtdServer.getAPIConfig(event.server));

  const player = onlinePlayers.find(p => p.steamid === event.player.steamId);

  const updatedPlayers = await Player.update(
    { id: event.player.id },
    {
      lastDeathLocationX: player.position.x,
      lastDeathLocationY: player.position.y,
      lastDeathLocationZ: player.position.z,
    }).fetch();

  if (!updatedPlayers[0]) {
    throw new Error('Player not found? Shouldnt happen, watcha doin mate..');
  }

  event.player = updatedPlayers[0];
  sails.log.debug(`Updated player ${event.player.id} last death location to ${event.player.positionX},${event.player.positionY},${event.player.positionZ}`, { playerId: event.player.id, server: event.server });


  return event;
};
