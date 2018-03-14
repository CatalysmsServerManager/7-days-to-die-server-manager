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

  '/changelog': {
    view: 'meta/changeLog'
  },

  '/sponsors/ldh': {
    view: 'meta/sponsors/letsdohosting'
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

  '/auth/discord': 'AuthController.discordLogin',
  '/auth/discord/return': 'AuthController.discordReturn',

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
  'get /sdtdserver/:serverId/players': 'SdtdServerController.get-players-view',
  'get /sdtdserver/:serverId/delete' : 'SdtdServerController.delete-server',
  'get /sdtdserver/:serverId/settings': 'SdtdServerController.settings',
  'get /sdtdserver/:serverId/info': 'SdtdServerController.server-info-view',
  'get /sdtdserver/:serverId/tickets': 'SdtdTicket.server-tickets-view',
  
  'get /player/:playerId/profile': 'PlayerController.profile',

  'get /user/:userId/tickets': 'SdtdTicket.user-tickets-view',
  'get /user/:userId/profile': 'User.profile',
  'get /user/:userId/dashboard': 'User.dashboard',

  
  'get /sdtdticket/:ticketId': 'SdtdTicket.view-ticket',


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

  // SDTDSERVER

  'get /api/sdtdserver/executeCommand': 'SdtdServerController.execute-command',
  'get /api/sdtdserver/sendMessage': 'SdtdServerController.send-message',
  'get /api/sdtdserver/loadServerInfo': 'SdtdServerController.load-server-info',
  'get /api/sdtdserver/players': 'SdtdServerController.get-players',
  'get /api/sdtdserver/info': 'SdtdServerController.load-server-info',
  'get /api/sdtdserver/availableItems': 'SdtdServerController.available-items',
  'get /api/sdtdserver/findwriteablechannelsinguild' : 'SdtdServerController/discordBot.find-writeable-channels-in-guild',
  
  'post /api/sdtdTicket/updateTicketStatus': 'SdtdTicket.update-ticket-status',
  'post /api/sdtdTicket/editTicket' : 'SdtdTicket.edit-ticket',
  'get /api/sdtdticket/opentickets' : 'SdtdTicketController.open-tickets',

  'post /api/sdtdserver/addserver': 'SdtdServerController/add-server',
  'post /api/sdtdserver/restartServer': 'SdtdServerController/restart-server',

  'post /api/sdtdserver/admin': 'SdtdController/add-admin',
  'delete /api/sdtdserver/admin': 'SdtdController/remove-admin',

  // Sdtd settings
  
  'post /api/sdtdserver/updateConnectionInfo': 'SdtdServerController.update-connection-info',
  'post /api/sdtdserver/toggleLogging': 'SdtdServerController.logging-toggle',

  'post /api/sdtdserver/toggleCountryBan': 'SdtdServerController/countryBan.country-ban-toggle',
  'post /api/sdtdserver/reloadCountryBan': 'SdtdServerController/countryBan.country-ban-reload',

  'post /api/sdtdserver/togglecommands': 'SdtdServerController/commands.commands-toggle',
  'post /api/sdtdserver/reloadcommands': 'SdtdServerController/commands.commands-reload',

  'post /api/sdtdserver/togglemotd': 'SdtdServerController/motd.motd-toggle',
  'post /api/sdtdserver/reloadmotd': 'SdtdServerController/motd.motd-reload',

  'post /api/sdtdserver/setGuild': 'SdtdServerController/discordBot.set-discord-guild',
  'post /api/sdtdserver/setchatchannel': 'SdtdServerController/discordBot.set-chat-channel',
  'post /api/sdtdserver/setnotificationchannel': 'SdtdServerController/discordBot.set-notification-channel',
  'post /api/sdtdserver/setcommandschannel': 'SdtdServerController/discordBot.set-commands-channel',


  // PLAYER

  'get /api/player/kick': "Player.kick",

  'post /api/player/ban': "Player.ban",
  "post /api/player/unban": "Player.unban",
  "post /api/player/giveitem": "player.give-item",
  "post /api/player/teleport": "player.teleport",

  'get /api/user/info': 'User.get-user-info',
  'get /api/user/ownedServers': "User.get-owned-servers",
  'get /api/user/findguildsmanagedbyuser': "User.find-guilds-managed-by-user",

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




  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝

  'get /sdtdserver/:serverId/socket': "SdtdServer.subscribe-to-socket"


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
