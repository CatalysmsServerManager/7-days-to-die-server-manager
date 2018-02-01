module.exports = async function isServerOwner(req, res, next) {
  if (_.isUndefined(req.signedCookies.userProfile)) {
    return res.badRequest('You have to be logged in.');
  }
  if (_.isUndefined(req.param('serverID')) && _.isUndefined(req.param('serverId')) && _.isUndefined(req.query.serverId) && _.isUndefined(req.query.serverID)) {
    return res.badRequest('No server ID given');
  }

  try {
    var serverId = req.param('serverID') || req.param('serverId') || req.query.serverId;
    var isOwner = false;
    let server = await SdtdServer.findOne({
      id: serverId
    });
    if (_.isUndefined(server)) {return res.notFound();}
    if (server.owner === req.signedCookies.userProfile.id) {
      sails.log.debug(`POLICY - isServerOwner - User ${req.signedCookies.userProfile.id} is owner of the server, approving request`);
      return next();
    } else {
      sails.log.debug(`POLICY - isServerOwner - User ${req.signedCookies.userProfile.id} tried to access a server without being owner`);
      return res.forbidden('You are not the server owner.');
    }

  } catch (error) {
    return res.serverError(error);
  }


};
