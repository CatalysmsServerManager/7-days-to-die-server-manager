async function getPlayersDataTable(req, res) {

  const whereObj = {
    server: req.body.serverId
  };
  const totalPlayers = await Player.count(whereObj);

  if (!!req.body.searchText) {
    whereObj.or = [
      { name: { contains: req.body.searchText } },
      { steamId: { contains: req.body.searchText } },
      { ip: { contains: req.body.searchText } }
    ];
    if (!isNaN(req.body.searchText)) {
      whereObj.or.push({ entityId: req.body.searchText });
    }
  }
  if (req.body.onlyOnline === 'true') {
    const steamIds = (await sails.helpers.sdtd.getOnlinePlayers(req.body.serverId))
      .filter(p => p.online).map(p => p.steamid);
    whereObj.steamId = { in: steamIds };
  }
  const rowCount = parseInt(req.body.endRow) - parseInt(req.body.startRow);
  const queryObj = {
    where: whereObj,
    select: req.body.fields,
    skip: req.body.startRow,
    limit: rowCount,
  };

  if (req.body.sortModel) {
    queryObj.sort = req.body.sortModel.map(col => { return  getSortCondition(col); });
  }

  const players = await Player.find(queryObj);

  // Sails doesnt let us sort and populate at the same time
  // So we load the role associations separately
  const playersWithRoles = await Promise.all(players.map(async player => {
    const role = await sails.helpers.sdtd.getPlayerRole(player.id);

    return {
      ...player,
      role
    };
  }));

  const totalFilter = await Player.count(whereObj);

  const result = {
    draw: parseInt(req.body.draw),
    recordsFiltered: totalFilter,
    recordsTotal: totalPlayers,
    data: playersWithRoles
  };


  return res.send(result);
}

/**
 * Converts Ag-Grid Sortmodel to Sejs Sortconditions
 * @param col
 */
function getSortCondition (col) {
  let condition;
  if (col.colId.includes('.')) {
    const parts = col.colId.split('.');
    condition = { [parts[0]]: col.sort };
  } else {
    condition = { [col.colId]: col.sort };
  }
  return condition;
}

module.exports = getPlayersDataTable;
