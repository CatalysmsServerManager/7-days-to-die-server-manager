
module.exports = async function isPatron(req, res, next) {
    try {
        if (_.isUndefined(req.session.userId)) {
            return res.redirect('/auth/steam');
        }
        let donatorStatus = await sails.helpers.meta.checkDonatorStatus.with({ userId: req.session.userId });
        if (donatorStatus === 'free') {
            sails.log.warn(`POLICY - isPatron - ${req.session.userId} tried to access a patron-only route!`);
            return res.badRequest();
        } else {
            return next();
        }
    } catch (error) {
        sails.log.error(`POLICY - isPatron - ${error}`);
    }
};
