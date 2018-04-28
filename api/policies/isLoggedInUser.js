module.exports = function isLoggedInUser(req, res, next) {
  if (!_.isUndefined(req.session.userId)) {

    if (_.isUndefined(req.param('userId')) && _.isUndefined(req.query.userId)) {
      return res.badRequest('No user ID given');
    }

    let userId = req.param('userId') || req.query.userId;

    if (userId == req.session.userId) {
      return next();

    } else {
      sails.log.warn(`POLICY - isLoggedInUser - User ${req.session.userId} tried to access a protected resource! ${req.originalUrl}`);
      return res.forbidden();

    }
  } else {
    return res.redirect('/auth/steam');
  }

};
