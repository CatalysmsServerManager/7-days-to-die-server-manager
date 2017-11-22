module.exports = async function isServerOwner(req, res, next) {
    if (_.isUndefined(req.session.userId)) { return res.badRequest('You have to be logged in.'); }
    if (_.isUndefined(req.param('serverID'))) { return res.badRequest('No server ID given'); }


    var isOwner = false;
    SdtdServer.findOne(req.param('serverID')).exec(function(err, foundServer) {
        if (err) { return res.serverError(`Error checking if you are server owner`); }
        if (foundServer.owner === req.session.userId) {
            isOwner = true;
        }
        if (isOwner) {
            sails.log.debug(`User ${req.session.userId} is owner of the server, approving request`);
            return next();
        } else {
            sails.log.debug(`User ${req.session.userId} tried to access a server without being owner`);
            return res.forbidden('You are not the server owner.');
        }
    });
};