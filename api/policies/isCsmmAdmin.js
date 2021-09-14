module.exports = function isCsmmAdmin(req, res, next) {
  return sails.hooks.policies.middleware.isloggedin(req, res, async function (err) {
    if (err) { return next(err); }
    if (req.session && req.session.userId) {
      const foundUser = await User.findOne(req.session.userId);
      if (foundUser) {
        if (sails.config.custom.adminSteamIds.includes(foundUser.steamId)) {
          return next();
        }
        sails.log.warn(`POLICY - isCsmmAdmin - ${req.ip} - ${foundUser.steamId} is not a csmm admin, redirecting to root`, {user: foundUser});
        return res.redirect('/');
      }
    }
    sails.log.warn(`POLICY - isCsmmAdmin - ${req.ip} is not a csmm admin, redirecting to root`);
    return res.redirect('/');
  });
};

