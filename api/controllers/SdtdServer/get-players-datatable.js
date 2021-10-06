// If you don't know wtf is going on here
// https://datatables.net/manual/server-side

async function getPlayersDataTable(req, res) {
  const whereObj = {
    server: req.body.serverId
  };
  const totalPlayers = await Player.count(whereObj);
  const rowCount = parseInt(req.body.endRow) - parseInt(req.body.startRow);
  const queryObj = {
    where: whereObj,
    //select: req.body.columns.map(c => c.data),
    sort: req.body.sortModel?.map(col => { return  getSortCondition(col) }),
    skip: req.body.startRow,
    limit: rowCount,
  };

  if (!_.isEmpty(req.body.search?.value)) {
    whereObj.or = [{
      name: {
        contains: req.body.search.value
      }
    },
    {
      steamId: {
        contains: req.body.search.value
      }
    },
    {
      ip: {
        contains: req.body.search.value
      }
    }
    ];


  }

  /*if (req.body.order?.length) {
    const colNumToSort = parseInt(req.body.order[0].column);
    const sortObj = {};
    sortObj[req.body.columns[colNumToSort].data] = req.body.order[0].dir;
    queryObj.sort = [sortObj];
  }*/


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
    condition = { [parts[0]]: { [parts[1]]: col.sort} };
  } else {
      condition = { [col.colId]: col.sort }
  }
  return condition;
}

module.exports = getPlayersDataTable;
