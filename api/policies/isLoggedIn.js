var passport = require('passport');

/**
 * isLoggedIn
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how this policy works and how to use it, see:
 *   https://sailsjs.com/anatomy/api/policies/isLoggedIn.js
 */
module.exports = function isLoggedIn(req, res, next) {

  passport.authenticate('jwt', function (err, user, info) {
    if (err) {
      return res.forbidden();
    }
    if (user) {
      return next()
    } else {
      return res.forbidden();
    }
  })(req, res, next)
};
