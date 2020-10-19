/**
 * Session Configuration
 * (sails.config.session)
 *
 * Use the settings below to configure session integration in your app.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For all available options, see:
 * https://sailsjs.com/config/session
 */

let useRedis = false;
if (process.env.REDISSTRING !== '') {
  useRedis = true;
}

module.exports.session = {
  isSessionDisabled: function (req){
    return !req.path.endsWith('/tile.png') && !!req.path.match(req._sails.LOOKS_LIKE_ASSET_RX);
  },
  adapter: '@sailshq/connect-redis',

  /***************************************************************************
   *                                                                          *
   * Session secret is automatically generated when your new app is created   *
   * Replace at your own risk in production-- you will invalidate the cookies *
   * of your users, forcing them to log in again.                             *
   *                                                                          *
   ***************************************************************************/
  secret: '77f6116db236079d792f21bb2393a89e',


  /***************************************************************************
   *                                                                          *
   * Customize when built-in session support will be skipped.                 *
   *                                                                          *
   * (Useful for performance tuning; particularly to avoid wasting cycles on  *
   * session management when responding to simple requests for static assets, *
   * like images or stylesheets.)                                             *
   *                                                                          *
   * https://sailsjs.com/config/session                                       *
   *                                                                          *
   ***************************************************************************/
  // isSessionDisabled: function (req){
  //   return !!req.path.match(req._sails.LOOKS_LIKE_ASSET_RX);
  // },

  url: useRedis ? process.env.REDISSTRING : undefined,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 * 7, // 1 week
  },
};
