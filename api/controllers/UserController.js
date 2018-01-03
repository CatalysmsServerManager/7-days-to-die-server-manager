module.exports = {

    /*****************/
    /* JSON requests */
    /*****************/

    /**
     * @description Gets a list of servers owned by a user
     * @memberof User
     * @param {number} userId ID of the user
     */
    ownedServers: function(req, res) {
        var userId = req.query.userId;

        if (_.isUndefined(userId)) { return res.badRequest("No userId given"); }

        SdtdServer.find({ owner: userId }).exec(function(err, foundServers) {
            if (err) { return res.serverError(new Error(`Error serversOwned`)); }
            res.json(foundServers);
        });
    }

};