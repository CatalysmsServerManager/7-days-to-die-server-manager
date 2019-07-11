// If you don't know wtf is going on here
// https://datatables.net/manual/server-side

async function getPlayersDataTable(req, res) {
  const whereObj = {
    server: req.body.serverId
  }

  const queryObj = {
    where: whereObj,
    limit: parseInt(req.body.length),
    select: req.body.columns.map(c => c.data),
    skip: parseInt(req.body.start),
  }

  if (!_.isEmpty(req.body.search.value)) {
    whereObj.name = {
      contains: req.body.search.value
    }
  }

  if (parseInt(req.body.order[0].column)) {
    const sortObj = {};
    sortObj[req.body.columns[parseInt(req.body.order[0].column)].data] = req.body.order[0].dir;
    queryObj.sort = [sortObj];
  }


  const players = await Player.find(queryObj).populate('role');

  const result = {
    draw: parseInt(req.body.draw),
    recordsTotal: players.length,
    data: players
  };


  return res.send(result);
}

module.exports = getPlayersDataTable;
