/**
 * isLoggedIn
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how this policy works and how to use it, see:
 *   https://sailsjs.com/anatomy/api/policies/isLoggedIn.js
 */
module.exports = function isLoggedIn(req, res, next) {
  if(!_.isUndefined(req.session) && !_.isUndefined(req.session.userId)) {
    return next();
  } else {
    sails.log.warn(`POLICY - isLoggedIn - ${req.ip} is not logged in, redirecting to ${req.originalUrl}`);
    if (req.session) {
      req.session.redirectTo = req.originalUrl
    }
    return res.redirect('/auth/steam');
  }
};
