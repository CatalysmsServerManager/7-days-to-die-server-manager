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
  steamLogin: function (req, res) {

    try {
      passport.authenticate('steam', {
        failureRedirect: `${process.env.CSMM_HOSTNAME}`,
      })(req, res);
    } catch (error) {
      sails.log.warn(`!!! - STEAM AUTH ERROR - !!!!`);
      sails.log.error(error);
      res.send(`Steam authentication error. This should never occur! Please report this on the dev server`, req);
    }


  },

  /**
   * @description Return link after steam login
   */

  steamReturn: function (req, res) {


    try {
      passport.authenticate('steam', {
        failureRedirect: '/login',
      },
        async function (err, user) {
          if (err) {
            sails.log.error(`Steam auth error - ${err}`);
            return res.serverError(err);
          };
          sails.log.info(`User ${user.username} successfully logged in`);
          req.session.userId = user.id;
          req.session.user = user;
          try {
            let players = await Player.find({
              steamId: user.steamId
            });
            let playerIds = players.map((player) => {
              return player.id;
            });
            await User.addToCollection(user.id, 'players').members(playerIds);

            if (req.session.redirectTo) {
              res.redirect(req.session.redirectTo);
            } else {
              res.redirect(`/user/${user.id}/dashboard`);
            }

          } catch (error) {
            sails.log.error(`AuthController - Error updating user profile ${error}`);
          }
        })(req, res);
    } catch (error) {
      sails.log.warn(`!!! - STEAM AUTH ERROR - !!!!`);
      sails.log.error(error);
      res.send(`Steam authentication error. This should never occur! Please report this on the dev server`, req);
    }


  },

  discordReturn: function (req, res) {

    try {
      passport.authenticate('discord', {
        failureRedirect: '/'
      }, async function (err, discordProfile) {
        if (err) {
          sails.log.error(`Discord auth error - ${err}`);
          return res.serverError(err);
        };

        try {
          const updatedUsers = await User.update({
            id: req.session.userId
          }, {
            discordId: discordProfile.id,
          }).fetch();

          sails.log.debug(`User ${req.session.userId} updated discord info successfully`);
          res.redirect(`/user/${req.session.userId}/dashboard`);

          // Attempt to sync player roles to Discord roles
          // No need to block the player while we are updating his roles
          try {
            const players = await Player.find({ where: { steamId: updatedUsers[0].steamId } });
            for (const player of players) {
              await sails.helpers.discord.setRoleFromDiscord(player.id);
            }
          } catch (e) {
            // Ok to just let this fail
            sails.log.error(e);
          }
        } catch (error) {
          sails.log.error(`AuthController:discordReturn - Error updating user profile ${error}`);
        }

      })(req, res);
    } catch (error) {
      sails.log.error(error);
      res.send(`Discord authentication error. This should never occur! Please report this on the dev server`);
    }


  },


  /**
   * @description login via discord
   */

  discordLogin: function (req, res) {
    try {
      passport.authenticate('discord', {
        failureRedirect: `${process.env.CSMM_HOSTNAME}`
      })(req, res);
    } catch (error) {
      sails.log.error(error);
      res.send(`Discord authentication error. This should never occur! Please report this on the dev server`);
    }


  },

  /**
   * @description Log out a user
   */

  logout: function (req, res) {
    delete req.session.userId;
    return res.redirect('/');
  },



};
