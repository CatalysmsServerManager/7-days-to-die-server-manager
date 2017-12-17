/**
 * PlayerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {

  kickPlayer: async function (req, res) {
    const playerID = req.param('playerID');
    const serverID = req.param('serverID');
    let reason;

    if (_.isUndefined(req.query.reason)) {
      reason = 'No reason given';
    } else {
      reason = req.query.reason;
    }

    let server = await sdtdServer.findOne(serverID);

    sevenDays.kickPlayer({
      ip: server.ip,
      port: server.webPort,
      authName: server.authName,
      authToken: server.authToken,
      playerID: playerID,
      reason: reason
    }).exec({
      unknownPlayer: function () {
        res.badRequest('Cannot kick player, invalid ID given!');
      },
      success: function () {
        res.ok();
      }
    });

  },


  // _____  ______  _____ _______            _____ _____ 
  // |  __ \|  ____|/ ____|__   __|     /\   |  __ \_   _|
  // | |__) | |__  | (___    | |       /  \  | |__) || |  
  // |  _  /|  __|  \___ \   | |      / /\ \ |  ___/ | |  
  // | | \ \| |____ ____) |  | |     / ____ \| |    _| |_ 
  // |_|  \_\______|_____/   |_|    /_/    \_\_|   |_____|

  getInventory: async function (req, res) {
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
      let playerInfo = await sails.helpers.loadPlayerData({
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
  },

  getBanStatus: async function(req, res) {
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
      let playerInfo = await sails.helpers.loadPlayerData({
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
};
