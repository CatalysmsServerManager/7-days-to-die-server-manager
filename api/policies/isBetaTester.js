/**
 * isBetaTester
 *
 * Check if logged in user is registered as beta tester.
 *
 */

module.exports = async function isBetaTester(req, res, next) {
  sails.log.silly(`POLICY - isBetaTester - Check if a user is logged in`);
  try {
    let user = await User.findOne(req.session.userId);
    if( sails.config.custom.betaTesters.includes(user.steamId) ) {
      sails.log.silly(`POLICY - isBetaTester - ${user.username} User ${req.session.userId} is a beta tester!`);
      return next();
    } else {
      sails.log.warn(`POLICY - isBetaTester - ${req.ip} tried to access a protected resource!`);
      return res.forbidden(`You are not a beta tester!`);
    }
  } catch (error) {
    sails.log.error(error);
    return res.serverError(error)
  }
};
