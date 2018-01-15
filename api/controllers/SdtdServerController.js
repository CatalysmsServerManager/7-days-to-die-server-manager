var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {

  // _____  ______  _____ _______            _____ _____
  // |  __ \|  ____|/ ____|__   __|     /\   |  __ \_   _|
  // | |__) | |__  | (___    | |       /  \  | |__) || |
  // |  _  /|  __|  \___ \   | |      / /\ \ |  ___/ | |
  // | | \ \| |____ ____) |  | |     / ____ \| |    _| |_
  // |_|  \_\______|_____/   |_|    /_/    \_\_|   |_____|

  /**
   * @memberof SdtdServer
   * @description GET online players
   * @param {number} serverID ID of the server
   */

  onlinePlayers: function (req, res) {
    const serverID = req.query.serverId;

    sails.log.debug(`Showing online players for ${serverID}`);

    if (_.isUndefined(serverID)) {
      return res.badRequest('No server ID given');
    } else {
      sails.models.sdtdserver.findOne({
        id: serverID
      }).exec(function (error, server) {
        if (error) {
          sails.log.error(error);
          res.serverError(error);
        }
        sevenDays.getOnlinePlayers({
          ip: server.ip,
          port: server.webPort,
          authName: server.authName,
          authToken: server.authToken,
        }).exec({
          error: function (error) {
            return res.serverError(error);
          },
          connectionRefused: function (error) {
            return res.badRequest(error);
          },
          unauthorized: function (error) {
            return res.badRequest(error);
          },
          success: function (data) {
            return res.status(200).json(data);
          }
        });
      });
    }
  },

};
