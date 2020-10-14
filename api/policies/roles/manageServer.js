module.exports = async function manageServer(req, res, next) {

  if (!req.session.user) {
    return res.redirect('/auth/steam');
  }

  if (!req.param('serverId') && !req.query.serverId) {
    return res.badRequest(`Error while running "manageServer" policy, could not determine server ID.`);
  }

  let serverId = req.param('serverId') ? req.param('serverId') : req.query.serverId;
  let server = await SdtdServer.findOne(serverId);
  let user = req.session.user;

  if(!server) {
    return res.badRequest(`Error while running "manageServer" policy, could not find a server.`);
  }

  let permCheck = await sails.helpers.roles.checkPermission.with({
    userId: user.id,
    serverId: server.id,
    permission: 'manageServer'
  });

  if (!permCheck.hasPermission) {
    sails.log.warn(`User ${user.username} tried to access ${req.path} without sufficient permissions (user is ${permCheck.role.name}).`);

    if (req.wantsJSON) {
      return res.status(403).json({
        error: `You do not have sufficient permissions! You need "manageServer" permission. Your current role is ${permCheck.role.name}.`
      });
    } else {
      return res.view('meta/notauthorized', {
        role: permCheck.role,
        requiredPerm: 'manageServer'
      });
    }


  }

  next();

};
