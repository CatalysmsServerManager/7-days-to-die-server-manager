module.exports = async (event) => {
  if (event.type !== 'playerDied') { return event; }

  if (!event.data.player) { throw new Error('Cannot store last death location when no player defined'); }

  await Player.update(
    { id: event.data.player.id },
    {
      lastDeathLocationX: event.data.player.positionX,
      lastDeathLocationY: event.data.player.positionY,
      lastDeathLocationZ: event.data.player.positionZ,
    });

  sails.log.debug(`Updated player ${event.data.player.id} last death location to ${event.data.player.positionX},${event.data.player.positionY},${event.data.player.positionZ}`);

  return event;
};
