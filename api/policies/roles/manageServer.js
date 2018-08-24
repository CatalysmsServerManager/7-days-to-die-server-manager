module.exports = async function manageServer(req, res, next) {

    if (_.isUndefined(req.session.user)) {
      return res.redirect('/auth/steam');
    }
  
    if (_.isUndefined(req.param('serverId')) && _.isUndefined(req.query.serverId)) {
      return res.badRequest(`Error while running "manageServer" policy, could not determine server ID.`);
    }
  
    let serverId = _.isUndefined(req.param('serverId')) ? req.query.serverId : req.param('serverId');
    let server = await SdtdServer.findOne(serverId);
    let user = req.session.user;
  
    let permCheck = await sails.helpers.roles.checkPermission.with({
      userId: user.id,
      serverId: server.id,
      permission: 'manageServer'
    });
  
    if (!permCheck.hasPermission) {
      sails.log.warn(`User ${user.username} tried to access ${req.path} without sufficient permissions (user is ${permCheck.role.name}).`)
      return res.view('meta/notauthorized', {
        role: permCheck.role,
        requiredPerm: 'manageServer'
      })
    }
  
    next();
  
  };
  