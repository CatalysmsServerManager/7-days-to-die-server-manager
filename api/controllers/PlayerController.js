/**
 * @memberof Player
 * @description  Get the contents of a players inventory
 * @param {string} steamId  Steam ID of the player
 * @param {string} serverId  ID of the server
 */

async function getInventory(req, res) {
  const steamId = req.query.steamId;
  const serverId = req.query.serverId;


  if (_.isUndefined(steamId)) {
    return res.badRequest('No steam ID given');
  }
  if (_.isUndefined(serverId)) {
    return res.badRequest('No server ID given');
  }
  try {
    let playerInfo = await sails.helpers.sdtd.loadPlayerData.with({
      serverId: serverId,
      steamId: steamId
    });

    let player = playerInfo[0];
    let toSend = new Object();
    toSend.id = player.id;
    toSend.steamId = player.steamId;
    toSend.serverId = player.server;
    toSend.inventory = player.inventory;
    sails.log.debug(`Showing inventory for player ${steamId} on server ${serverId}`, {serverId, player});
    return res.json(toSend);
  } catch (error) {
    sails.log.error(error);
    return res.badRequest();
  }
}

/**
 * @memberof Player
 * @description Get ban status of a player
 * @param {string} steamId  Steam ID of the player
 * @param {string} serverId  ID of the server
 */

async function getBanStatus(req, res) {
  const steamId = req.query.steamId;
  const serverId = req.query.serverId;


  if (_.isUndefined(steamId)) {
    return res.badRequest('No steam ID given');
  }
  if (_.isUndefined(serverId)) {
    return res.badRequest('No server ID given');
  }

  try {
    let playerInfo = await sails.helpers.sdtd.loadPlayerData.with({
      serverId: serverId,
      steamId: steamId
    });

    let player = playerInfo[0];
    let toSend = new Object();
    toSend.id = player.id;
    toSend.steamId = player.steamId;
    toSend.serverId = player.server;
    toSend.banned = player.banned;
    sails.log.debug(`Showing ban status for player ${steamId} on server ${serverId}`, {serverId, player});
    return res.json(toSend);
  } catch (error) {
    sails.log.error(error);
    return res.badRequest();
  }
}

/**
 * @memberof Player
 * @description Get location of a player
 * @param {string} steamId  Steam ID of the player
 * @param {string} serverId  ID of the server
 */

async function getLocation(req, res) {
  const steamId = req.query.steamId;
  const serverId = req.query.serverId;


  if (_.isUndefined(steamId)) {
    return res.badRequest('No steam ID given');
  }
  if (_.isUndefined(serverId)) {
    return res.badRequest('No server ID given');
  }

  try {
    let playerInfo = await sails.helpers.sdtd.loadPlayerData.with({
      serverId: serverId,
      steamId: steamId
    });

    let player = playerInfo[0];
    let toSend = new Object();
    toSend.id = player.id;
    toSend.steamId = player.steamId;
    toSend.serverId = player.server;
    toSend.location = player.location;
    sails.log.debug(`Showing location info for player ${steamId} on server ${serverId}`, {serverId, player});
    return res.json(toSend);
  } catch (error) {
    sails.log.error(error);
    return res.badRequest();
  }
}



module.exports = {
  getInventory: getInventory,
  getBanStatus: getBanStatus,
  getLocation: getLocation
};
