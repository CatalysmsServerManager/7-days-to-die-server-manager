/**
 * PlayerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {

  kickPlayer: async function(req, res) {
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
      unknownPlayer: function() {
        res.badRequest('Cannot kick player, invalid ID given!');
      },
      success: function() {
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

  getInventory: function(req, res) {
    
  }

};
