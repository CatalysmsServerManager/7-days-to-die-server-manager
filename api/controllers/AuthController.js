/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var passport = require('passport');

module.exports = {

    steamLogin: function(req, res, next) {
        sails.log.debug(`Logging in a user via steam`);
        passport.authenticate('steam', {
            failureRedirect: 'http://localhost:1337/about'
        })(req, res);

    },

    steamReturn: function(req, res) {
        passport.authenticate('steam', {
                failureRedirect: '/login'
            },
            function(err, user) {
                if (err) {
                    console.log(err)
                    return res.serverError(err)
                };
                sails.log.debug(`User with id ${user.id} successfully logged in`);
                res.cookie('userProfile', user, { signed: true });
                res.redirect('/');
            })(req, res);
    },

    logout: function(req, res) {

    },


};