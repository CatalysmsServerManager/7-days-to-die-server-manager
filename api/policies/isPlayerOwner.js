module.exports = async function isPlayerOwner(req, res, next) {

  if (_.isUndefined(req.param('playerId')) && _.isUndefined(req.query.playerId)) {
    return res.badRequest('No player ID given');
  }

  if (_.isUndefined(req.session.userId)) {
    return res.redirect('/auth/steam');
  }

  try {
    var playerId = req.param('playerId') || req.query.playerId;
    var isOwner = false;
    let player = await Player.findOne(playerId);

    if (_.isUndefined(player) || _.isUndefined(player.server)) {
      return res.notFound();
    }

    let server = await SdtdServer.findOne(player.server).populate('admins');
    let user = await User.findOne(req.session.userId);

    if (_.isUndefined(server)) {
      return res.notFound();
    }

    if (_.isUndefined(user)) {
      return res.redirect('/auth/steam');
    }


    if (server.owner === user.id) {
      isOwner = true;
    }

    server.admins.forEach(admin => {
      if (admin.id === user.id) {
        isOwner = true;
      }
    });


    if (isOwner) {
      sails.log.silly(`POLICY - isPlayerOwner - User ${user.id} is owner of the player, approving request`);
      return next();
    } else {
      sails.log.warn(`POLICY - isPlayerOwner - User ${user.id} tried to access a player without being owner ${req.originalUrl}`);
      return res.forbidden('You are not the player owner.');
    }

  } catch (error) {
    return res.serverError(error);
  }


};
