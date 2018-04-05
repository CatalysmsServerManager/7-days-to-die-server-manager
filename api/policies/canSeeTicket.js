module.exports = async function canSeeTicket(req, res, next) {

    if (_.isUndefined(req.param('ticketId')) && _.isUndefined(req.query.ticketId)) {
        return res.badRequest('No ticket ID given');
    }

    if (_.isUndefined(req.session.userId)) {
        return res.redirect('/auth/steam');
    }

    try {
        let ticketId = req.param('ticketId') || req.query.ticketId;
        let user = await User.findOne(req.session.userId);
        let ticket = await SdtdTicket.findOne(ticketId).populate('player');
        let server = await SdtdServer.findOne(ticket.server).populate('admins');



        if (user.steamId == ticket.player.steamId || isServerAdmin(user, ticket, server)) {
            return next();
        } else {
            return res.forbidden();
        }

    } catch (error) {
        sails.log.error(`POLICY - canSeeTicket - ${error}`)
    }

};


function isServerAdmin(user, ticket, server) {
    let canAccess = false
    if (server.owner === user.id) {
        canAccess = true
    }

    server.admins.forEach(admin => {
        if (admin.id === user.id) {
            canAccess = true
        }
    })

    return canAccess
}