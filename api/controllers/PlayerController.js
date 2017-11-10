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

  }


};
