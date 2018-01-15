/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` your home page.            *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

  '/': {
    view: 'index'
  },

  '/about': {
    view: 'about'
  },

  '/auth/steam': {
    controller: 'AuthController',
    action: 'steamLogin'
  },

  '/auth/steam/return': {
    controller: 'AuthController',
    action: 'steamReturn'
  },

  '/auth/logout': {
    controller: 'AuthController',
    action: 'logout'
  },

  /***************************************************************************
     *                                                                          *
     * More custom routes here...                                               *
     * (See https://sailsjs.com/config/routes for examples.)                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the routes in this file, it   *
     * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
     * not match any of those, it is matched against static assets.             *
     *                                                                          *
     ***************************************************************************/

  'get /sdtdserver/addserver': {
    view: 'sdtdServer/addserver'
  },

  'get /sdtdserver/:serverId/dashboard': 'SdtdServerController.dashboard',
  'get /sdtdserver/:serverId/console': 'SdtdServerController.console',
  'get /sdtdserver/:serverId/chat': 'SdtdServerController.chat',


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

  'post /api/sdtdserver/addserver': 'SdtdServerController/add-server',
  '/api/sdtdserver/executeCommand': 'SdtdServerController.execute-command',
  '/api/sdtdserver/sendMessage': 'SdtdServerController.send-message',
  '/api/sdtdserver/loadServerInfo': 'SdtdServerController.load-server-info',
  '/api/sdtdserver/toggleLogging': 'SdtdServerController.logging-toggle',
  'get /api/sdtdserver/players': 'SdtdServerController.get-players',
  'get /api/sdtdserver/info': 'SdtdServerController.load-server-info',

  'get /api/user/ownedServers': {
    controller: 'User',
    action: 'ownedServers',
    skipAssets: true
  },

  'get /api/player/inventory': {
    controller: 'Player',
    action: 'getInventory',
    skipAssets: true
  },

  'get /api/player/ban': {
    controller: 'Player',
    action: 'getBanStatus',
    skipAssets: true
  },

  'get /api/player/location': {
    controller: 'Player',
    action: 'getLocation',
    skipAssets: true
  },

  'get /api/player/kick': {
    controller: 'Player',
    action: 'kick',
    skipAssets: true
  },


  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝

  'get /sdtdserver/:serverId/socket': "SdtdServer.subscribe-to-socket"


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
