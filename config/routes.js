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

  '/donate': {
    view: 'meta/donate'
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
  'get /sdtdserver/:serverId/delete': 'SdtdServerController.delete-server',
  'get /sdtdserver/:serverId/settings': 'SdtdServerController.settings',
  'get /sdtdserver/:serverId/info': 'SdtdServerController.server-info-view',
  'get /sdtdserver/:serverId/tickets': 'SdtdTicket.server-tickets-view',
  'get /sdtdserver/:serverId/analytics': 'SdtdServerController/historicalData.view-analytics',
  'get /sdtdserver/:serverId/economy': 'SdtdServerController/economy.economy-view',

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
  'get /api/sdtdserver/findwriteablechannelsinguild': 'SdtdServerController/discordBot.find-writeable-channels-in-guild',
  'get /api/sdtdserver/onlinestatus': 'SdtdServerController.is-online',
  'get /api/sdtdserver/fps': 'SdtdServerController.get-fps',
  'get /api/sdtdserver/allowedCommands' : 'CustomCommandController.get-allowed-commands',

  // Economy

  'post /api/sdtdserver/economy': 'SdtdServerController/economy.enable-economy',
  'delete /api/sdtdserver/economy': 'SdtdServerController/economy.disable-economy',

  'post /api/sdtdserver/economy/module': 'SdtdServerController/economy.enable-economy-module',
  'delete /api/sdtdserver/economy/module': 'SdtdServerController/economy.disable-economy-module',

  'post /api/sdtdserver/economy/cost': 'SdtdServerController/economy.set-cost',
  'post /api/sdtdserver/economy/currencyname': 'SdtdServerController/economy.set-currency-name',

  'post /api/sdtdserver/economy/module/playtimeearner/amount': 'SdtdServerController/economy.set-playtime-earner-amount',
  'post /api/sdtdserver/economy/module/playtimeearner/interval': 'SdtdServerController/economy.set-playtime-earner-interval',

  'post /api/sdtdserver/economy/module/discordtextearner/amount': 'SdtdServerController/economy.set-discord-text-earner-amount',
  'post /api/sdtdserver/economy/module/discordtextearner/timeout': 'SdtdServerController/economy.set-discord-text-earner-timeout',

  // Shop Listing

  "post /api/shop/listing" : "ShopController.listing-add",
  "delete /api/shop/listing" : "ShopController.listing-delete",

  // Historical data

  'get /api/sdtdserver/data/memupdate': 'SdtdServerController/historicalData.get-mem-update',

  // Tickets

  'post /api/sdtdTicket/updateTicketStatus': 'SdtdTicket.update-ticket-status',
  'post /api/sdtdTicket/editTicket': 'SdtdTicket.edit-ticket',
  'get /api/sdtdticket/opentickets': 'SdtdTicketController.open-tickets',
  'post /api/sdtdticket/comment': 'sdtdTicketController.add-comment',
  'delete /api/sdtdticket/comment': 'sdtdTicketController.remove-comment',
  'put /api/sdtdticket/comment': 'sdtdTicketController.edit-comment',

  'post /api/sdtdserver/addserver': 'SdtdServerController/add-server',
  'post /api/sdtdserver/restartServer': 'SdtdServerController/restart-server',

  'get /api/sdtdserver/admins': 'SdtdServerController.get-admins',
  'post /api/sdtdserver/admin': 'SdtdServerController.add-admin',
  'delete /api/sdtdserver/admin': 'SdtdServerController.remove-admin',

  // Sdtd settings

  'post /api/sdtdserver/updateConnectionInfo': 'SdtdServerController.update-connection-info',
  'post /api/sdtdserver/toggleLogging': 'SdtdServerController.logging-toggle',

  // Countryban
  'post /api/sdtdserver/toggleCountryBan': 'SdtdServerController/countryBan.country-ban-toggle',
  'post /api/sdtdserver/reloadCountryBan': 'SdtdServerController/countryBan.country-ban-reload',

  'get /api/sdtdserver/countryban/country': 'SdtdServerController/countryBan.get-banned-countries',
  'post /api/sdtdserver/countryban/country': 'SdtdServerController/countryBan.add-country',
  'delete /api/sdtdserver/countryban/country': 'SdtdServerController/countryBan.remove-country',

  'get /api/sdtdserver/countryban/whitelist': 'SdtdServerController/countryBan.get-whitelist',
  'post /api/sdtdserver/countryban/whitelist': 'SdtdServerController/countryBan.add-to-whitelist',
  'delete /api/sdtdserver/countryban/whitelist': 'SdtdServerController/countryBan.remove-from-whitelist',

  // Commands
  'post /api/sdtdserver/commands/reload': 'SdtdServerController/commands.commands-reload',

  'post /api/sdtdserver/commands': "SdtdServerController/commands.enable-commands",
  'get /api/sdtdserver/commands': "SdtdServerController/commands.get-commands-status",
  'delete /api/sdtdserver/commands': "SdtdServerController/commands.disable-commands",

  'post /api/sdtdserver/commands/prefix': "SdtdServerController/commands.set-prefix",
  'get /api/sdtdserver/commands/prefix': "SdtdServerController/commands.get-prefix",

  'delete /api/sdtdserver/commands/custom' : 'CustomCommandController/delete-command',
  'post /api/sdtdserver/commands/custom' : 'CustomCommandController/create-command',
  'post /api/sdtdserver/commands/custom/name' : 'CustomCommandController/update-name',
  'post /api/sdtdserver/commands/custom/commandstoexecute' : 'CustomCommandController/update-commands-to-execute',
  'post /api/sdtdserver/commands/custom/cost' : 'CustomCommandController/update-cost',
  'post /api/sdtdserver/commands/custom/enabled' : 'CustomCommandController/update-enabled',
  'post /api/sdtdserver/commands/custom/delay' : 'CustomCommandController/update-delay',
  'post /api/sdtdserver/commands/custom/timeout' : 'CustomCommandController/update-timeout',

  'post /api/sdtdserver/commands/calladmin': "SdtdServerController/commands.enable-calladmin",
  'delete /api/sdtdserver/commands/calladmin': "SdtdServerController/commands.disable-calladmin",
  'get /api/sdtdserver/commands/calladmin': "SdtdServerController/commands.get-calladmin",

  'post /api/sdtdserver/commands/playerteleports': "SdtdServerController/commands.enable-player-teleports",
  'delete /api/sdtdserver/commands/playerteleports': "SdtdServerController/commands.disable-player-teleports",
  'get /api/sdtdserver/commands/playerteleports': "SdtdServerController/commands.get-player-teleports",

  'post /api/sdtdserver/commands/playerteleports/maxlocations': "SdtdServerController/commands.set-max-teleport-locations",
  'get /api/sdtdserver/commands/playerteleports/maxlocations': "SdtdServerController/commands.get-max-teleport-locations",

  'post /api/sdtdserver/commands/playerteleports/timeout': "SdtdServerController/commands.set-teleport-timeout",
  'get /api/sdtdserver/commands/playerteleports/timeout': "SdtdServerController/commands.get-teleport-timeout",

  'post /api/sdtdserver/commands/playerteleports/delay': 'SdtdServerController/commands.set-teleport-delay',

  // MOTD
  'post /api/sdtdserver/togglemotd': 'SdtdServerController/motd.motd-toggle',
  'post /api/sdtdserver/reloadmotd': 'SdtdServerController/motd.motd-reload',

  //Discord
  'post /api/sdtdserver/setGuild': 'SdtdServerController/discordBot.set-discord-guild',
  'post /api/sdtdserver/setchatchannel': 'SdtdServerController/discordBot.set-chat-channel',
  'post /api/sdtdserver/setnotificationchannel': 'SdtdServerController/discordBot.set-notification-channel',
  'post /api/sdtdserver/discord/prefix': 'SdtdServerController/discordBot.set-prefix',


  // PLAYER

  'get /api/player/kick': "Player.kick",
  'get /api/player/teleports': 'Player.get-teleports',

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

  "get /api/user/steamid": "User.find-users-by-steam-id",


  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝

  'get /sdtdserver/:serverId/socket': "SdtdServer.subscribe-to-socket"


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
