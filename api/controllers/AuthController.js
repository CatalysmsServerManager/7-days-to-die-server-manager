var passport = require('passport');

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
  steamLogin: function (req, res, next) {
    passport.authenticate('steam', {
      failureRedirect: `${process.env.CSMM_HOSTNAME}`
    })(req, res);

  },

  /**
   * @description Return link after steam login
   */

  steamReturn: function (req, res) {
    passport.authenticate('steam', {
        failureRedirect: '/login'
      },
      async function (err, user) {
        if (err) {
          sails.log.error(`Steam auth error - ${err}`);
          return res.serverError(err);
        };
        sails.log.info(`User ${user.username} successfully logged in`);
        req.session.userId = user.id;
        try {
          let players = await Player.find({
            steamId: user.steamId
          });
          let playerIds = players.map((player) => {
            return player.id;
          });
          await User.addToCollection(user.id, 'players').members(playerIds);
        } catch (error) {
          sails.log.error(`AuthController - Error updating user profile ${error}`);
        }

        res.redirect(`/user/${user.id}/dashboard`);
      })(req, res);
  },

  discordReturn: function (req, res) {
    passport.authenticate('discord', {
        failureRedirect: '/'
      },
      async function (err, discordProfile) {
        if (err) {
          sails.log.error(`Discord auth error - ${err}`);
          return res.serverError(err);
        };

        try {
          await User.update({
            id: req.session.userId
          }, {
            discordId: discordProfile.id,
          });
          sails.log.debug(`User ${req.session.userId} updated discord info successfully`);
          res.redirect('/');
        } catch (error) {
          sails.log.error(`AuthController:discordReturn - Error updating user profile ${error}`);
        }

      })(req, res);
  },


  /**
   * @description login via discord
   */

  discordLogin: function (req, res, next) {
    sails.log.debug(`Logging in a user via discord`);
    passport.authenticate('discord', {
      failureRedirect: `${process.env.CSMM_HOSTNAME}`
    })(req, res);

  },

  /**
   * @description Log out a user
   */

  logout: function (req, res) {
    delete req.session.userId;
    return res.redirect('/');
  },



};
