/**
 * isLoggedIn
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how this policy works and how to use it, see:
 *   https://sailsjs.com/anatomy/api/policies/isLoggedIn.js
 */
module.exports = function isServerOwner(req, res, next) {

    if (req.param('serverID') && req.session.servers) {
        let serverID = req.param("serverID");
        let sessionServers = req.session.servers;
        let isOwner = false

        _.each(sessionServers, function(server) {
            if (server.id == serverID) {
                isOwner = true
            }
        })

        if (isOwner) {
            return next();
        } else {
            return res.forbidden();
        }
    }

    return res.forbidden();




};