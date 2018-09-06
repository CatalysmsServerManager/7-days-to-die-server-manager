module.exports = async function manageEconomy(req, res, next) {

  if (_.isUndefined(req.session.user)) {
    return res.redirect('/auth/steam');
  }

  if (_.isUndefined(req.param('serverId')) && _.isUndefined(req.query.serverId)) {
    return res.badRequest(`Error while running "hasAccess" policy, could not determine server ID.`);
  }

  let serverId = _.isUndefined(req.param('serverId')) ? req.query.serverId : req.param('serverId');
  let server = await SdtdServer.findOne(serverId);
  let user = req.session.user;

  let role = await sails.helpers.roles.getUserRole(user.id, serverId)


  if (role.manageEconomy || role.managePlayers || role.manageRoles || role.manage || role.viewDashboard || role.useTracking || role.viewAnalytics || role.manageTickets) {
    next()
  } else {
    return res.view('meta/notauthorized', {
      role: role,
      requiredPerm: 'any'
    })
  }


};
