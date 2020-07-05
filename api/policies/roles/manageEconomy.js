module.exports = async function manageEconomy(req, res, next) {

  if (_.isUndefined(req.session.user)) {
    return res.redirect('/auth/steam');
  }

  if (_.isUndefined(req.param('serverId')) && _.isUndefined(req.query.serverId)) {
    return res.badRequest(`Error while running "manageEconomy" policy, could not determine server ID.`);
  }

  let serverId = _.isUndefined(req.param('serverId')) ? req.query.serverId : req.param('serverId');
  let server = await SdtdServer.findOne(serverId);
  let user = req.session.user;

  let permCheck = await sails.helpers.roles.checkPermission.with({
    userId: user.id,
    serverId: server.id,
    permission: 'manageEconomy'
  });

  if (!permCheck.hasPermission) {
    sails.log.warn(`User ${user.username} tried to access ${req.path} without sufficient permissions (user is ${permCheck.role.name}).`);

    if (req.wantsJSON) {
      return res.status(403).json({
        error: `You do not have sufficient permissions! You need "manageEconomy" permission. Your current role is ${permCheck.role.name}.`
      });
    } else {
      return res.view('meta/notauthorized', {
        role: permCheck.role,
        requiredPerm: 'manageEconomy'
      });
    }


  }

  next();

};
