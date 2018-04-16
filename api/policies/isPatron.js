
module.exports = function isPatron(req, res, next) {
    if (!_.isUndefined(req.session.userId)) {
        return next();
    } else {
        return res.redirect('/auth/steam');
    }


    try {
        if (_.isUndefined(req.session.userId)) {
            return res.redirect('/auth/steam');
        }
        let donatorStatus = sails.helpers.meta.checkDonatorStatus.with({ userId: req.session.userId });

        if (donatorStatus === 'free') {
            sails.log.warn(`POLICY - isLoggedIn - ${req.session.userId} tried to access a patron-only route!`);
            return res.badRequest();
        } else {
            return next();
        }
    } catch (error) {
        sails.log.error(`POLICY - isPatron - ${error}`);
    }
};
