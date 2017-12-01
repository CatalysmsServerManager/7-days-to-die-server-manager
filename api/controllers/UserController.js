/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    welcome: function(req, res) {
        const userID = req.signedCookies.userProfile.id;
        if (_.isUndefined(userID)) {
            return res.badRequest("No userID given");
        }
        return res.view('welcome', {
            userProfile: req.signedCookies.userProfile,
            userName: req.signedCookies.userProfile.displayName,
            userId: req.signedCookies.userProfile.id
        });
    },

    /*****************/
    /* JSON requests */
    /*****************/

    ownedServers: function(req, res) {
        var userId = req.query.userId;

        if (_.isUndefined(userId)) { return res.badRequest("No userId given"); }

        SdtdServer.find({ owner: userId }).exec(function(err, foundServers) {
            if (err) { return res.serverError(new Error(`Error serversOwned`)); }
            res.json(foundServers);
        });
    }

};