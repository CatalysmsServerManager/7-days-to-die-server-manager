// If you don't know wtf is going on here
// https://datatables.net/manual/server-side

const sevenDays = require('machinepack-7daystodiewebapi');

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
    ]
    if (!isNaN(req.body.searchText)) {
      whereObj.or.push({ entityId: req.body.searchText });
    }
  }
  if (req.body.onlyOnline === 'true') {
    const server = await SdtdServer.findOne(req.body.serverId);
    const playerList = await getPlayerList(server);
    let steamIds = playerList.players.filter(p => p.online).map(p => p.steamid);
    whereObj.steamId = { in: steamIds }
  }
  const rowCount = parseInt(req.body.endRow) - parseInt(req.body.startRow);
  const queryObj = {
    where: whereObj,
    select: req.body.fields,
    sort: req.body.sortModel?.map(col => { return  getSortCondition(col) }),
    skip: req.body.startRow,
    limit: rowCount,
  };

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
      condition = { [col.colId]: col.sort }
  }
  return condition;
}

/**
 * Get Players List from 7dtd Server
 * @param server
 */
async function getPlayerList(server) {
  return new Promise((resolve) => {
    sevenDays.getPlayerList({
      ip: server.ip,
      port: server.webPort,
      authName: server.authName,
      authToken: server.authToken
    }).exec({
      error: function () {
        resolve({
          players: []
        });
      },
      success: function (playerList) {
        resolve(playerList);
      }
    });
  });
}

module.exports = getPlayersDataTable;
