module.exports = function isServerOwner(req, res, next) {

    if (req.param('serverID') && req.session.servers) {
        let serverID = req.param('serverID');
        let sessionServers = req.session.servers;
        let isOwner = false;

        _.each(sessionServers, function(server) {
            if (server.id == serverID) {
                isOwner = true;
            }
        });

        if (isOwner) {
            return next();
        } else {
            return res.forbidden('You are not the owner of this server.');
        }
    }

    return res.forbidden("Could not verify your identity, please log in.");
};