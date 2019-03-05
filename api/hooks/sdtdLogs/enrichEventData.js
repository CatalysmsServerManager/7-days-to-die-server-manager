module.exports = async function enrichEventData(event) {

  let newData = event.data;

  switch (event.type) {
    case 'playerKill':
      newData.victimPlayer = await Player.findOne({
        server: event.server.id,
        name: event.data.victimName
      });
      newData.killerPlayer = await Player.findOne({
        server: event.server.id,
        name: event.data.killerName
      });
      break;

    default:
      break;
  }

  return newData;

};
