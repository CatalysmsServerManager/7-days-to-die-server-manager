/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var Passwords = require('machinepack-passwords');

module.exports = {


    /**
     * `UserController.login()`
     */
    login: function(req, res) {
        User.findOne({
            where: {
                username: req.param('username')
            }
        }, function foundUser(err, createdUser) {
            if (err) return res.negotatiate(err);
            if (!createdUser) return res.notFound();

            Passwords.checkPassword({
                passwordAttempt: req.param('password'),
                encryptedPassword: createdUser.encryptedPassword
            }).exec({
                error: function(err) {
                    return res.negotiate(err);
                },

                incorrect: function() {
                    return res.notFound();
                },

                success: function() {

                    if (createdUser.banned) {
                        return res.forbidden("'Your account has been banned, most likely for adding dog videos in violation of the Terms of Service.  Please contact Chad or his mother.'");
                    }

                    req.session.userId = createdUser.id;

                    return res.ok();

                }
            });
        })
    },

    /**
     * `UserController.logout()`
     */
    logout: function(req, res) {

        User.findOne(req.session.userId, function foundUser(err, user) {
            if (err) return res.negotiate(err);
            if (!user) {
                sails.log.verbose('Session refers to a user who no longer exists.');
                return res.redirect('/');
            }

            // log the user-agent out.
            req.session.userId = null;

            return res.ok();
        });
    },


    /**
     * `UserController.signup()`
     */
    signup: function(req, res) {
        sails.log(req.params)
        if (_.isUndefined(req.param('password'))) {
            return res.badRequest('A password is required!');
        }

        if (req.param('password').length < 6) {
            return res.badRequest('Password must be at least 6 characters!');
        }

        if (_.isUndefined(req.param('username'))) {
            return res.badRequest('A username is required!');
        }

        // username must be at least 4 characters
        if (req.param('username').length < 4) {
            return res.badRequest('Username must be at least 4 characters!');
        }

        // Username must contain only numbers and letters.
        if (!_.isString(req.param('username')) || req.param('username').match(/[^a-z0-9]/i)) {
            return res.badRequest('Invalid username: must consist of numbers and letters only.');
        }

        // Validation of input is ok, we start creating the user

        Passwords.encryptPassword({
            password: req.param('password'),
        }).exec({

            error: function(err) {
                return res.serverError(err);
            },

            success: function(result) {

                var options = {};

                options.username = req.param('username');
                options.encryptedPassword = result;

                User.create(options).meta({ fetch: true }).exec(function(err, createdUser) {
                    if (err) {
                        console.log('the error is: ', err);

                        // Check for duplicate username
                        if (err.invalidAttributes && err.invalidAttributes.username && err.invalidAttributes.username[0] && err.invalidAttributes.username[0].rule === 'unique') {

                            // return res.send(409, 'Username is already taken by another user, please try again.');
                            return res.alreadyInUse(err);
                        }
                        return res.negotiate(err);
                    }


                    // Log the user in
                    req.session.userId = createdUser.id;

                    return res.view('welcome')
                });
            }
        });
    },


};