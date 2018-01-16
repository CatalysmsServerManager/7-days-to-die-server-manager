/**
 * isLoggedIn
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how this policy works and how to use it, see:
 *   https://sailsjs.com/anatomy/api/policies/isLoggedIn.js
 */
module.exports = function isLoggedIn(req, res, next) {
  sails.log.debug(`POLICY - isLoggedIn - Check if a user is logged in`);
  if(!_.isUndefined(req.signedCookies.userProfile)) {
    sails.log.debug(`POLICY - isLoggedIn - User ${req.signedCookies.userProfile.id} identified`);
    return next();
  } else {
    sails.log.debug(`POLICY - isLoggedIn - Cannot identify user`);
    return res.forbidden();
  }
};
