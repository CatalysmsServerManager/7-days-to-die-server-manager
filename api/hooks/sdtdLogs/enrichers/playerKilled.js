module.exports = async (event) => {
  if (event.type !== 'playerKilled') { return event; }

  event.victim = await Player.findOne({
    server: event.server.id,
    name: event.victimName
  });
  event.killer = await Player.findOne({
    server: event.server.id,
    name: event.killerName
  });
  event.victim.role = await sails.helpers.sdtd.getPlayerRole(event.victim.id);
  event.killer.role = await sails.helpers.sdtd.getPlayerRole(event.killer.id);

  return event;
};
