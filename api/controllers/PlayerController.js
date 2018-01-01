var sevenDays = require('machinepack-7daystodiewebapi');

/**
 * PlayerController
 *
 * @module PlayerController
 * @description  Server-side actions for handling incoming requests regarding ingame players
 */

/**
 * @description  Get the contents of a players inventory
 * @param {string} steamId  Steam ID of the player
 * @param {string} serverId  ID of the server
 */

async function getInventory(req, res) {
  const steamId = req.query.steamId;
  const serverId = req.query.serverId;

  sails.log.debug(`Showing inventory for player ${steamId} on server ${serverId}`);

  if (_.isUndefined(steamId)) {
    return res.badRequest("No steam ID given");
  }
  if (_.isUndefined(serverId)) {
    return res.badRequest("No server ID given");
  }
  try {
    let playerInfo = await sails.helpers.loadPlayerData.with({
      serverId: serverId,
      steamId: steamId
    })

    let player = playerInfo.players[0]
    let toSend = new Object();
    toSend.id = player.id,
      toSend.steamId = player.steamId,
      toSend.serverId = player.server
    toSend.inventory = player.inventory
    return res.json(toSend)
  } catch (error) {
    sails.log.error(error)
    return res.badRequest()
  }
}

/**
 * @description Get ban status of a player
 * @param {string} steamId  Steam ID of the player
 * @param {string} serverId  ID of the server
 */

async function getBanStatus (req, res) {
  const steamId = req.query.steamId;
  const serverId = req.query.serverId;

  sails.log.debug(`Showing ban status for player ${steamId} on server ${serverId}`);

  if (_.isUndefined(steamId)) {
    return res.badRequest("No steam ID given");
  }
  if (_.isUndefined(serverId)) {
    return res.badRequest("No server ID given");
  }

  try {
    let playerInfo = await sails.helpers.loadPlayerData.with({
      serverId: serverId,
      steamId: steamId
    })

    let player = playerInfo.players[0]
    let toSend = new Object();
    toSend.id = player.id,
      toSend.steamId = player.steamId,
      toSend.serverId = player.server
    toSend.banned = player.banned
    return res.json(toSend)
  } catch (error) {
    sails.log.error(error)
    return res.badRequest()
  }
}

/**
 * @description Get location of a player
 * @param {string} steamId  Steam ID of the player
 * @param {string} serverId  ID of the server
 */

async function getLocation (req, res) {
  const steamId = req.query.steamId;
  const serverId = req.query.serverId;

  sails.log.debug(`Showing location info for player ${steamId} on server ${serverId}`);

  if (_.isUndefined(steamId)) {
    return res.badRequest("No steam ID given");
  }
  if (_.isUndefined(serverId)) {
    return res.badRequest("No server ID given");
  }

  try {
    let playerInfo = await sails.helpers.loadPlayerData.with({
      serverId: serverId,
      steamId: steamId
    })

    let player = playerInfo.players[0]
    let toSend = new Object();
    toSend.id = player.id,
      toSend.steamId = player.steamId,
      toSend.serverId = player.server
    toSend.location = player.location
    return res.json(toSend)
  } catch (error) {
    sails.log.error(error)
    return res.badRequest()
  }
}

/**
 * @description Kick a player
 * @param {string} steamId  Steam ID of the player
 * @param {string} serverId  ID of the server
 */

async function kick (req, res) {
  const steamId = req.query.steamId;
  const serverId = req.query.serverId;

  sails.log.debug(`Kicking player ${steamId} on server ${serverId}`);

  if (_.isUndefined(steamId)) {
    return res.badRequest("No steam ID given");
  }
  if (_.isUndefined(serverId)) {
    return res.badRequest("No server ID given");
  }

  let server = await SdtdServer.findOne(serverId);
  let reason;
  if (_.isUndefined(req.query.reason)) {
    reason = 'No reason given';
  } else {
    reason = req.query.reason;
  }

  sevenDays.kickPlayer({
    ip: server.ip,
    port: server.webPort,
    authName: server.authName,
    authToken: server.authToken,
    playerID: steamId,
    reason: reason
  }).exec({
    error: function (error) {
      res.badRequest(error)
    },
    unknownPlayer: function () {
      res.badRequest('Cannot kick player, invalid ID given!');
    },
    success: function (response) {
      res.json(response);
    }
  });
}

module.exports = {
  getInventory: getInventory,
  getBanStatus: getBanStatus,
  getLocation: getLocation,
  kick: kick
};
