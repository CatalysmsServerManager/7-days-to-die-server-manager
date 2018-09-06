module.exports = async function managePlayers(req, res, next) {

  if (_.isUndefined(req.session.user)) {
    return res.redirect('/auth/steam');
  }

  if ((_.isUndefined(req.param('serverId')) && _.isUndefined(req.query.serverId)) && _.isUndefined(req.param('playerId')) && _.isUndefined(req.query.playerId)) {
    return res.badRequest(`Error while running "managePlayers" policy, could not determine server ID or player ID.`);
  }

  let playerId = _.isUndefined(req.param('playerId')) ? req.query.playerId : req.param('playerId');
  let serverId = _.isUndefined(req.param('serverId')) ? req.query.serverId : req.param('serverId');
  let server
  if (serverId) {
    server = await SdtdServer.findOne(serverId);
  } else {
    player = await Player.findOne(playerId);
    server = await SdtdServer.findOne(player.server)
  }
  let user = req.session.user;

  let permCheck = await sails.helpers.roles.checkPermission.with({
    userId: user.id,
    serverId: server.id,
    permission: 'managePlayers'
  });

  if (!permCheck.hasPermission) {
    sails.log.warn(`User ${user.username} tried to access ${req.path} without sufficient permissions (user is ${permCheck.role.name}).`)

    if (req.wantsJSON) {
      return res.status(403).json({
        error: `You do not have sufficient permissions! You need "managePlayers" permission. Your current role is ${permCheck.role.name}.`
      });
    } else {
      return res.view('meta/notauthorized', {
        role: permCheck.role,
        requiredPerm: 'managePlayers'
      })
    }


  }

  next();

};
