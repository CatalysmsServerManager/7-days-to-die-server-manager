/**
 * isBetaTester
 *
 * Check if logged in user is registered as beta tester.
 *
 */
module.exports = function isBetaTester(req, res, next) {
    sails.log.debug(`POLICY - isBetaTester - Check if a user is logged in`);
    if( sails.config.custom.betaTesters.includes(req.signedCookies.userProfile.steamId) ) {
      sails.log.debug(`POLICY - isBetaTester - ${req.signedCookies.userProfile.userName} User ${req.signedCookies.userProfile.id} is a beta tester!`);
      return next();
    } else {
      sails.log.debug(`POLICY - isBetaTester - User is not in beta testers list`);
      return res.forbidden(`You are not a beta tester!`);
    }
  };
  