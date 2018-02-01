var passport = require('passport');
var jwt = require('jsonwebtoken');

/**
 * AuthController
 *
 * @description Server-side actions for handling incoming requests regarding authentication.
 * @module AuthController
 */


module.exports = {

  /**
     * @description Authenticate a user via steam
     */
  steamLogin: function(req, res, next) {
    sails.log.debug(`Logging in a user via steam`);
    passport.authenticate('steam', {
      failureRedirect: `${process.env.CSMM_HOSTNAME}`
    })(req, res);

  },

  /**
     * @description Return link after steam login
     */

  steamReturn: function(req, res) {
    passport.authenticate('steam', {
      failureRedirect: '/login'
    },
    async function(err, user) {
      if (err) {
        sails.log.error(`Steam auth error - ${err}`);
        return res.serverError(err);
      };
      sails.log.debug(`User with id ${user.id} successfully logged in`);
      res.cookie('userProfile', user, { signed: true });
      try {
        let players = await Player.find({steamId: user.steamId});
        let playerIds = players.map((player) => {return player.id;});
        await User.addToCollection(user.id, 'players').members(playerIds);
      } catch (error) {
        sails.log.error(`AuthController - Error updating user profile ${error}`);
      }

      res.redirect('/');
    })(req, res);
  },

  /**
     * @description Log out a user, clears the encrypted cookie
     */

  logout: function(req, res) {
    res.clearCookie('userProfile');
    return res.redirect('/');
  },



};
