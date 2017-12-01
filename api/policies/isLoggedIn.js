/**
 * isLoggedIn
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how this policy works and how to use it, see:
 *   https://sailsjs.com/anatomy/api/policies/isLoggedIn.js
 */
module.exports = function isLoggedIn(req, res, next) {

    console.log(req.cookies)
    if (req.signedCookies.userProfile) {
        sails.log.debug(`User ${req.session.userId} is logged in, allowing request`);
        return next();
    }

    // this request did not come from a logged-in user.
    sails.log.debug(`User is NOT logged in, blocking request`);
    return res.forbidden();

};