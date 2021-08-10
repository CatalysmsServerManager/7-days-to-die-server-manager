module.exports = async (event) => {
  if (event.type !== 'playerKilled') {return event;}

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

  return event;
};
