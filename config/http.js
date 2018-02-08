/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

/**
 * PASSPORT CONFIGURATION
 */

var passport = require('passport');
var SteamStrategy = require('passport-steam');
var DiscordStrategy = require('passport-discord').Strategy;



/**
 * Steam strategy config
 */

let steamAPIkey = process.env.API_KEY_STEAM;
passport.use(new SteamStrategy({
  returnURL: `${process.env.CSMM_HOSTNAME}/auth/steam/return`,
  realm: `${process.env.CSMM_HOSTNAME}`,
  apiKey: steamAPIkey
}, function (identifier, profile, done) {
  User.findOrCreate({
      steamId: profile.id
    }, {
      steamId: profile.id,
      username: profile.displayName
    })
    .then(foundUser => {
      foundUser.steamProfile = profile;
      return done(null, foundUser);
    })
    .catch(err => {
      sails.log.error(err);
      return done(err);
    });
}));

let discordScopes = ['identify', 'guilds', 'bot'];

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORDCLIENTID,
  clientSecret: process.env.DISCORDCLIENTSECRET,
  callbackURL: `${process.env.CSMM_HOSTNAME}/auth/discord/return`,
  scope: discordScopes
}, async function (accessToken, refreshToken, profile, cb) {
  try {
    return cb(null, profile);
  } catch (error) {
    sails.log.error(`Discord auth error! ${error}`)
  }
}));


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (steamId, done) {
  User.findOne({
    steamId: steamId
  }, function (err, user) {
    sails.log.error(err);
    done(err, user);
  });
});


module.exports.http = {

  /****************************************************************************
   *                                                                           *
   * Sails/Express middleware to run for every HTTP request.                   *
   * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
   *                                                                           *
   * https://sailsjs.com/documentation/concepts/middleware                     *
   *                                                                           *
   ****************************************************************************/

  middleware: {

    passportInit: require('passport').initialize(),
    passportSession: require('passport').session(),

    /***************************************************************************
     *                                                                          *
     * The order in which middleware should be run for HTTP requests.           *
     * (This Sails app's routes are handled by the "router" middleware below.)  *
     *                                                                          *
     ***************************************************************************/

    order: [
      'cookieParser',
      'session',
      'passportInit',
      'passportSession',
      'bodyParser',
      'compress',
      'poweredBy',
      'router',
      'www',
      'favicon',
    ],


    /***************************************************************************
     *                                                                          *
     * The body parser that will handle incoming multipart HTTP requests.       *
     *                                                                          *
     * https://sailsjs.com/config/http#?customizing-the-body-parser             *
     *                                                                          *
     ***************************************************************************/

    // bodyParser: (function _configureBodyParser(){
    //   var skipper = require('skipper');
    //   var middlewareFn = skipper({ strict: true });
    //   return middlewareFn;
    // })(),

  },

};
