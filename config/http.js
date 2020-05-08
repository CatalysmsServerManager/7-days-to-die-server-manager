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

const morgan = require('morgan');

const {
  customLogger
} = require('./customLog');

/**
 * PASSPORT CONFIGURATION
 */

var passport = require('passport');
var SteamStrategy = require('passport-steam');
var DiscordStrategy = require('passport-discord').Strategy;
const Sentry = require('@sentry/node');

var maxAge = 900;
/**
 * Steam strategy config
 */

let steamAPIkey = process.env.API_KEY_STEAM;
passport.use(new SteamStrategy({
  returnURL: `${process.env.CSMM_HOSTNAME}/auth/steam/return`,
  realm: `${process.env.CSMM_HOSTNAME}`,
  apiKey: steamAPIkey
}, async function (identifier, profile, done) {
  try {
    let foundUser = await User.findOrCreate({
      steamId: profile._json.steamid
    }, {
      steamId: profile._json.steamid,
      username: profile._json.personaname
    })
    let updatedUser = await User.update({
      id: foundUser.id
    }, {
      username: profile._json.personaname,
      avatar: profile._json.avatarfull
    }).fetch()
    foundUser.steamProfile = profile;
    return done(null, foundUser);
  } catch (error) {
    sails.log.warn(`Error during steam auth!`)
    sails.log.error(error)
    res.send(`Error during steam auth. This should never happen. Please contact someone on the dev server`)
  }

}));

let discordScopes = ['identify', 'guilds'];

if (process.env.DISCORDCLIENTID && process.env.DISCORDCLIENTSECRET && process.env.CSMM_HOSTNAME) {
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

} else {
  console.log(`No Discord client ID and/or client secret given in dotenv. Discarding Discord passport configuration`);
}



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

morgan.token('userId', function (req, res) {
  if (req.session) {
    return req.session.userId
  } else {
    return "Not logged in"
  }
})


const morganLogger = morgan(':remote-addr - :userId - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', {
  "stream": customLogger.stream,
  skip: (req, res) => {
    if (process.env.IS_TEST) { return true; }
    return !req.originalUrl.includes('api')
  }
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
    xframe: require('lusca').xframe('SAMEORIGIN'),
    sentryRequest: Sentry.Handlers.requestHandler(),
    sentryError: Sentry.Handlers.errorHandler(),
    morgan: morganLogger,

    /***************************************************************************
     *                                                                          *
     * The order in which middleware should be run for HTTP requests.           *
     * (This Sails app's routes are handled by the "router" middleware below.)  *
     *                                                                          *
     ***************************************************************************/

    order: [
      'sentryRequest',
      'sentryError',
      'cookieParser',
      'session',
      'passportInit',
      'passportSession',
      'xframe',
      'morgan',
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
