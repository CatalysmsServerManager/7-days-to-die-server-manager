module.exports = async function serverDisabledMiddleware(req, res, next) {
  if (!req.param('serverId') && !req.query.serverId) {
    return next();
  }

  let serverId = req.param('serverId') ? req.param('serverId') : req.query.serverId;
  let server = await SdtdServer.findOne(serverId);

  if (!server) {
    return next();
  }

  if (server.disabled) {
    res.send(403, 'This server is disabled');
    return res.end();
  }

  return next();
};
