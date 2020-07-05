
module.exports = async function isPatron(req, res, next) {
  try {
    if (_.isUndefined(req.session.userId)) {
      return res.redirect('/auth/steam');
    }

    const serverId = req.param('serverId') || req.query.serverId;

    if (serverId) {
      let donatorStatus = await sails.helpers.meta.checkDonatorStatus.with({ serverId: parseInt(serverId, 10) });
      if (donatorStatus === 'free') {
        sails.log.warn(`POLICY - isPatron - ${req.session.userId} tried to access a patron-only route! ${req.originalUrl}`);
        return res.badRequest('You must donate to access this feature.');
      } else {
        return next();
      }
    } else {
      let donatorStatus = await sails.helpers.meta.checkDonatorStatus.with({ userId: req.session.userId });
      if (donatorStatus === 'free') {
        sails.log.warn(`POLICY - isPatron - ${req.session.userId} tried to access a patron-only route! ${req.originalUrl}`);
        return res.badRequest('You must donate to access this feature.');
      } else {
        return next();
      }
    }



  } catch (error) {
    sails.log.error(`POLICY - isPatron - ${error}`);
    return res.badRequest();
  }
};
