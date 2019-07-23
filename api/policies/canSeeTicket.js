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
    let server = await SdtdServer.findOne(ticket.server);

    let userRole = await sails.helpers.roles.getUserRole(user.id, server.id);


    if (user.steamId == ticket.player.steamId || userRole.manageTickets || userRole.manageServer) {
      return next();
    } else {
      return res.view('meta/notauthorized', {
        role: userRole,
        requiredPerm: 'manageTickets'
      })
    }

  } catch (error) {
    sails.log.error(`POLICY - canSeeTicket - ${error}`)
  }

};
