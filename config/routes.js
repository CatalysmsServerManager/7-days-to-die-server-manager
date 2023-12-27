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
    view: 'index',
  },

  '/donate': {
    view: 'meta/donate',
  },

  '/privacy': {
    view: 'meta/privacy',
  },

  '/stats': {
    view: 'meta/stats',
  },

  '/sdtdserver/:id/playground*': {
    view: 'sdtdServer/playground',
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


  '/gbl': 'SdtdServerController.view-gbl',
  '/gbl/profile': 'PlayerController.view-gbl',

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

  'get /sdtdserver/addserver': 'SdtdServerController.add-server-view',

  'get /sdtdserver/:serverId/dashboard': 'SdtdServerController.dashboard',
  'get /sdtdserver/:serverId/console': 'SdtdServerController.console',
  'get /sdtdserver/:serverId/chat': 'SdtdServerController.chat',
  'get /sdtdserver/:serverId/players': 'SdtdServerController.get-players-view',
  'get /sdtdserver/:serverId/tracker': 'SdtdServerController.view-tracking',
  'get /sdtdserver/:serverId/delete': 'SdtdServerController.delete-server',
  'get /sdtdserver/:serverId/settings': 'SdtdServerController.settings',
  'get /sdtdserver/:serverId/info': 'SdtdServerController.server-info-view',
  'get /sdtdserver/:serverId/tickets': 'SdtdTicket.server-tickets-view',
  'get /sdtdserver/:serverId/analytics':
    'SdtdServerController/historicalData.view-analytics',
  'get /sdtdserver/:serverId/economy':
    'SdtdServerController/economy.economy-view',
  'get /shop/:serverId': 'ShopController.view-shop',

  'get /player/:playerId/profile': 'PlayerController.profile',

  'get /user/:userId/tickets': 'SdtdTicket.user-tickets-view',
  'get /user/:userId/profile': 'User.profile',
  'get /user/:userId/dashboard': 'User.dashboard',
  'get /user/me': 'User.me',

  'get /sdtdticket/:ticketId': 'SdtdTicket.view-ticket',

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

  'post /api/playground/execute': {
    action: 'Playground/execute',
    csrf: false
  },

  'get /api/playground/meta': {
    action: 'Playground/get-meta',
  },

  'get /api/playground/variable': {
    action: 'Playground/variables/get-variables',
  },

  'get /api/playground/variable/check': {
    action: 'Playground/variables/check-variable',
  },

  'delete /api/playground/variable/:variableId': {
    action: 'Playground/variables/delete-variable',
    csrf: false
  },

  'put /api/playground/variable/lock': {
    action: 'Playground/variables/lock-variable',
    csrf: false
  },

  'put /api/playground/variable/:id': {
    action: 'Playground/variables/edit-variable',
    csrf: false
  },

  'get /api/playground/executions': {
    action: 'Playground/get-executions',
  },

  'get /api/stats': {
    action: 'etc/get-system-stats',
    cors: false
  },

  'get /health': {
    action: 'etc/health',
    cors: false
  },

  // GBL
  'get /api/gbl/total': 'gbl.get-total-bans',
  'get /api/gbl/find': 'gbl.search-steamid',
  'post /api/gbl/load': 'gbl.load-bans',
  'post /api/gbl/note': 'gbl.set-note',

  'delete /api/gbl': 'gbl.delete-ban',

  'get /api/gbl/comment': 'gbl-comment.get-comment',
  'post /api/gbl/comment': 'gbl-comment.place-comment',
  'patch /api/gbl/comment': 'gbl-comment.edit-comment',
  'delete /api/gbl/comment': 'gbl-comment.remove-comment',

  'post /api/gbl/comment/heart': 'gbl-comment.toggle-heart',

  'post /api/sdtdserver/gbl/autoban': 'gbl.set-autoban-status',
  'post /api/sdtdserver/gbl/autoban/bans': 'gbl.set-autoban-bans',
  'post /api/sdtdserver/gbl/notification/bans': 'gbl.set-notification-bans',

  // SDTDSERVER

  'get /admin/import': 'AdminController.import-view',
  'get /api/admin/export': 'AdminController.export',
  'post /api/admin/import': 'AdminController.import',

  'get /api/sdtdserver/export': 'SdtdServerController.export',
  'post /api/sdtdserver/executeCommand': 'SdtdServerController.execute-command',
  'get /api/sdtdserver/sendMessage': 'SdtdServerController.send-message',
  'get /api/sdtdserver/loadServerInfo': 'SdtdServerController.load-server-info',
  'get /api/sdtdserver/players': 'SdtdServerController.get-players',
  // This is a post because actions2 is stupid about query string parsing ¯\_(ツ)_/¯
  'post /api/sdtdserver/players/datatable':
    'SdtdServerController.get-players-datatable',
  'get /api/sdtdserver/:serverId/players/export':
    'SdtdServerController.get-players-export',
  'get /api/sdtdserver/players/all': 'SdtdServerController.load-all-players',
  'get /api/sdtdserver/info': 'SdtdServerController.load-server-info',
  'get /api/sdtdserver/availableItems': 'SdtdServerController.available-items',
  'get /api/sdtdserver/findwriteablechannelsinguild':
    'SdtdServerController/discordBot.find-writeable-channels-in-guild',
  'get /api/sdtdserver/onlinestatus': 'SdtdServerController.is-online',
  'get /api/sdtdserver/fps': 'SdtdServerController.get-fps',
  'get /api/sdtdserver/allowedCommands':
    'CustomCommandController.get-allowed-commands',
  'get /api/sdtdserver/donatorStatus': 'SdtdServerController.check-donator',
  'get /api/sdtdserver/failedstatus': 'SdtdServerController.get-failed-status',
  'get /api/sdtdserver/mod': 'SdtdServerController.get-mod-version',
  'get /api/sdtdserver/:serverId/tile/:z/:x/:y/tile.png': 'SdtdServerController.server-tile',

  'delete /api/sdtdserver/players': 'SdtdServerController.delete-players',
  'delete /api/sdtdserver/players/teleports': 'SdtdServerController.wipe-teleports',
  'delete /api/sdtdserver/players/currency': 'SdtdServerController.wipe-currency',

  // Ping kicker

  'post /api/sdtdserver/pingkicker/status':
    'SdtdServerController/pingKicker.set-pingKick-status',
  'post /api/sdtdserver/pingkicker/message':
    'SdtdServerController/pingKicker.set-pingKick-message',
  'post /api/sdtdserver/pingkicker/maxping':
    'SdtdServerController/pingKicker.set-pingKick-maxping',
  'post /api/sdtdserver/pingkicker/checks':
    'SdtdServerController/pingKicker.set-pingKick-checks',
  'post /api/sdtdserver/pingkicker/whitelist':
    'SdtdServerController/pingKicker.set-pingKick-whitelist',

  // Banned items

  'get /api/sdtdserver/bannedItems':
    'BannedItemListController/get-banned-items',
  'post /api/sdtdserver/bannedItems/status':
    'BannedItemListController/set-banned-item-status',
  'post /api/sdtdserver/bannedItems/item':
    'BannedItemListController/add-banned-item',
  'post /api/sdtdserver/bannedItems/command':
    'BannedItemListController/set-command',
  'delete /api/sdtdserver/bannedItems/item':
    'BannedItemListController/remove-banned-item',

  'get /api/sdtdserver/bannedItems/tier':
    'BannedItemListController/get-tiers',
  'post /api/sdtdserver/bannedItems/tier':
    'BannedItemListController/create-banned-item-tier',
  'delete /api/sdtdserver/bannedItems/tier':
    'BannedItemListController/delete-banned-item-tier',

  // Roles

  'get /api/role': 'roleController/get-role',
  'delete /api/role': 'roleController/delete-role',
  'post /api/role': 'roleController/create-role',
  'patch /api/role': 'roleController/update-role',

  'get /api/permission': 'roleController/check-permission',

  'post /api/role/player': 'roleController/add-player',
  'delete /api/role/player': 'roleController/remove-player',

  // Custom hooks

  'get /api/sdtdserver/hook': 'CustomHookController/get-custom-hook',
  'post /api/sdtdserver/hook': 'CustomHookController/add-custom-hook',
  'patch /api/sdtdserver/hook': 'CustomHookController/edit-custom-hook',
  'delete /api/sdtdserver/hook': 'CustomHookController/delete-custom-hook',

  'post /api/sdtdserver/hook/variable':
    'CustomHookController/variable/add-hook-variable',
  'delete /api/sdtdserver/hook/variable':
    'CustomHookController/variable/delete-hook-variable',

  // Economy

  'post /api/sdtdserver/economy': 'SdtdServerController/economy.enable-economy',
  'delete /api/sdtdserver/economy':
    'SdtdServerController/economy.disable-economy',

  'get /api/sdtdserver/economy/logs':
    'SdtdServerController/economy.get-economy-logs',

  'post /api/sdtdserver/economy/module':
    'SdtdServerController/economy.enable-economy-module',
  'delete /api/sdtdserver/economy/module':
    'SdtdServerController/economy.disable-economy-module',

  'post /api/sdtdserver/economy/cost': 'SdtdServerController/economy.set-cost',
  'post /api/sdtdserver/economy/currencyname':
    'SdtdServerController/economy.set-currency-name',

  'post /api/sdtdserver/economy/module/playtimeearner/config':
    'SdtdServerController/economy.set-playtime-earner-config',

  'post /api/sdtdserver/economy/module/discordtextearner/amount':
    'SdtdServerController/economy.set-discord-text-earner-amount',
  'post /api/sdtdserver/economy/module/discordtextearner/timeout':
    'SdtdServerController/economy.set-discord-text-earner-timeout',

  'post /api/sdtdserver/economy/module/killearner/playerkill':
    'SdtdServerController/economy.set-kill-earner-playerkill',
  'post /api/sdtdserver/economy/module/killearner/zombiekill':
    'SdtdServerController/economy.set-kill-earner-zombiekill',

  'post /api/player/balance': 'PlayerController.set-balance',

  // Shop Listing

  'get /api/shop/export': 'ShopController.shop-export',
  'post /api/shop/import': 'ShopController.shop-import',

  'get /api/shop/listing': 'ShopController.get-listings',
  'post /api/shop/listing': 'ShopController.listing-add',
  'delete /api/shop/listing': 'ShopController.listing-delete',
  'patch /api/shop/listing': 'ShopController.listing-edit',
  'post /api/shop/listing/buy': 'ShopController.listing-buy',

  'delete /api/shop/claim': 'ShopController.delete-claim',

  // Saved teleports

  'get /api/sdtdserver/teleport': 'SdtdServerController/teleports.get-teleport',
  'post /api/sdtdserver/teleport': 'SdtdServerController/teleports.add-teleport',
  'delete /api/sdtdserver/teleport': 'SdtdServerController/teleports.delete-teleport',

  // Historical data

  'get /api/sdtdserver/data/memupdate':
    'SdtdServerController/historicalData.get-mem-update',
  'get /api/sdtdserver/data/fps': 'SdtdServerController/historicalData.get-fps',
  'post /api/sdtdserver/data/purge':
    'SdtdServerController/historicalData.purge',

  // Tracking

  'post /api/sdtdserver/tracking/delete': 'tracking-info.purge',
  'post /api/sdtdserver/tracking/location':
    'tracking-info.set-location-tracking',
  'post /api/sdtdserver/tracking/inventory':
    'tracking-info.set-inventory-tracking',

  'get /api/sdtdserver/tracking/stats': 'tracking-info.get-tracking-stats',
  'get /api/sdtdserver/tracking': 'tracking-info.get-tracking-info',
  'get /api/sdtdserver/tracking/location':
    'tracking-info.get-tracking-info-by-location',
  'get /api/sdtdserver/tracking/landClaims':
    'SdtdServerController.load-land-claims',

  // Tickets

  'post /api/sdtdTicket/updateTicketStatus': 'SdtdTicket.update-ticket-status',
  'post /api/sdtdTicket/editTicket': 'SdtdTicket.edit-ticket',
  'get /api/sdtdticket/opentickets': 'SdtdTicketController.open-tickets',
  'post /api/sdtdticket/comment': 'sdtdTicketController.add-comment',
  'delete /api/sdtdticket/comment': 'sdtdTicketController.remove-comment',
  'put /api/sdtdticket/comment': 'sdtdTicketController.edit-comment',

  'post /api/sdtdserver/addserver': 'SdtdServerController/add-server',
  'post /api/sdtdserver/restartServer': 'SdtdServerController/restart-server',

  // Sdtd settings

  'post /api/sdtdserver/updateConnectionInfo':
    'SdtdServerController.update-connection-info',
  'post /api/sdtdserver/toggleLogging': 'SdtdServerController.logging-toggle',
  'post /api/sdtdserver/inactive': 'SdtdServerController.set-active-status',
  'post /api/sdtdserver/settings': 'SdtdServerController.set-settings',

  // Cron

  'get /api/sdtdserver/cron/export': 'cron-job.cron-export',
  'post /api/sdtdserver/cron/import': 'cron-job.cron-import',

  'post /api/sdtdserver/cron': 'cron-job.create',
  'patch /api/sdtdserver/cron': 'cron-job.edit',
  'get /api/sdtdserver/cron/list': 'cron-job.list',
  'delete /api/sdtdserver/cron': 'cron-job.delete',
  'post /api/sdtdserver/cron/status': 'cron-job.enable',
  'delete /api/sdtdserver/cron/status': 'cron-job.disable',
  'post /api/sdtdserver/cron/test': 'cron-job.test',
  'post /api/sdtdserver/cron/notifications': 'cron-job.enable-notifications',
  'delete /api/sdtdserver/cron/notifications': 'cron-job.disable-notifications',

  // Countryban
  'post /api/sdtdserver/toggleCountryBan':
    'SdtdServerController/countryBan.country-ban-toggle',
  'post /api/sdtdserver/reloadCountryBan':
    'SdtdServerController/countryBan.country-ban-reload',

  'get /api/sdtdserver/countryban/country':
    'SdtdServerController/countryBan.get-banned-countries',
  'post /api/sdtdserver/countryban/country':
    'SdtdServerController/countryBan.add-country',
  'delete /api/sdtdserver/countryban/country':
    'SdtdServerController/countryBan.remove-country',

  'post /api/sdtdserver/countryban/ban':
    'SdtdServerController/countryBan.enable-ban',
  'delete /api/sdtdserver/countryban/ban':
    'SdtdServerController/countryBan.disable-ban',

  'get /api/sdtdserver/countryban/whitelist':
    'SdtdServerController/countryBan.get-whitelist',
  'post /api/sdtdserver/countryban/whitelist':
    'SdtdServerController/countryBan.add-to-whitelist',
  'delete /api/sdtdserver/countryban/whitelist':
    'SdtdServerController/countryBan.remove-from-whitelist',

  // Commands

  'post /api/sdtdserver/commands':
    'SdtdServerController/commands.enable-commands',
  'get /api/sdtdserver/commands':
    'SdtdServerController/commands.get-commands-status',
  'delete /api/sdtdserver/commands':
    'SdtdServerController/commands.disable-commands',

  'post /api/sdtdserver/commands/prefix':
    'SdtdServerController/commands.set-prefix',
  'get /api/sdtdserver/commands/prefix':
    'SdtdServerController/commands.get-prefix',

  'get /api/sdtdserver/commands/export':
    'CustomCommandController.command-export',
  'post /api/sdtdserver/commands/import':
    'CustomCommandController.command-import',

  'delete /api/sdtdserver/commands/custom':
    'CustomCommandController/delete-command',
  'post /api/sdtdserver/commands/custom':
    'CustomCommandController/create-command',
  'post /api/sdtdserver/commands/custom/name':
    'CustomCommandController/update-name',
  'post /api/sdtdserver/commands/custom/commandstoexecute':
    'CustomCommandController/update-commands-to-execute',
  'post /api/sdtdserver/commands/custom/cost':
    'CustomCommandController/update-cost',
  'post /api/sdtdserver/commands/custom/enabled':
    'CustomCommandController/update-enabled',
  'post /api/sdtdserver/commands/custom/delay':
    'CustomCommandController/update-delay',
  'post /api/sdtdserver/commands/custom/level':
    'CustomCommandController/update-level',
  'post /api/sdtdserver/commands/custom/output':
    'CustomCommandController/update-output',
  'post /api/sdtdserver/commands/custom/timeout':
    'CustomCommandController/update-timeout',
  'post /api/sdtdserver/commands/custom/description':
    'CustomCommandController/update-description',
  'post /api/sdtdserver/commands/custom/argument':
    'CustomCommandController/create-argument',
  'delete /api/sdtdserver/commands/custom/argument':
    'CustomCommandController/delete-argument',
  'patch /api/sdtdserver/commands/custom/argument':
    'CustomCommandController/edit-argument',

  'post /api/sdtdserver/commands/calladmin':
    'SdtdServerController/commands.enable-calladmin',
  'delete /api/sdtdserver/commands/calladmin':
    'SdtdServerController/commands.disable-calladmin',
  'get /api/sdtdserver/commands/calladmin':
    'SdtdServerController/commands.get-calladmin',

  'post /api/sdtdserver/commands/who':
    'SdtdServerController/commands.set-status-who',

  'post /api/sdtdserver/commands/playerteleports':
    'SdtdServerController/commands.enable-player-teleports',
  'delete /api/sdtdserver/commands/playerteleports':
    'SdtdServerController/commands.disable-player-teleports',
  'get /api/sdtdserver/commands/playerteleports':
    'SdtdServerController/commands.get-player-teleports',

  'post /api/sdtdserver/commands/playerteleports/maxlocations':
    'SdtdServerController/commands.set-max-teleport-locations',
  'get /api/sdtdserver/commands/playerteleports/maxlocations':
    'SdtdServerController/commands.get-max-teleport-locations',

  'post /api/sdtdserver/commands/playerteleports/timeout':
    'SdtdServerController/commands.set-teleport-timeout',
  'get /api/sdtdserver/commands/playerteleports/timeout':
    'SdtdServerController/commands.get-teleport-timeout',

  'post /api/sdtdserver/commands/playerteleports/delay':
    'SdtdServerController/commands.set-teleport-delay',

  'post /api/sdtdserver/commands/gimme':
    'SdtdServerController/commands/gimme.set-gimme-status',
  'post /api/sdtdserver/commands/gimme/cooldown':
    'SdtdServerController/commands/gimme.set-gimme-cooldown',
  'post /api/sdtdserver/commands/gimme/item':
    'SdtdServerController/commands/gimme.add-gimme-item',
  'delete /api/sdtdserver/commands/gimme/item':
    'SdtdServerController/commands/gimme.delete-gimme-item',
  'patch /api/sdtdserver/commands/gimme/item':
    'SdtdServerController/commands/gimme.edit-gimme-item',

  'post /api/sdtdserver/commands/vote/status':
    'SdtdServerController/votes/set-vote-status',
  'post /api/sdtdserver/commands/vote/command':
    'SdtdServerController/votes/set-vote-command',
  'post /api/sdtdserver/commands/vote/apiKey':
    'SdtdServerController/votes/set-vote-api-key',

  // Command replies

  'get /api/sdtdserver/commands/reply': 'CommandReplyController/get-reply',
  'post /api/sdtdserver/commands/reply': 'CommandReplyController/add-reply',
  'delete /api/sdtdserver/commands/reply':
    'CommandReplyController/delete-reply',

  // Player teleports

  'get /api/sdtdserver/playerteleports': 'player-teleport.get-teleports',
  'post /api/teleport': 'player-teleport.edit-teleport',
  'delete /api/teleport': 'player-teleport.delete-teleport',

  //Discord
  'post /api/sdtdserver/setGuild':
    'SdtdServerController/discordBot.set-discord-guild',
  'post /api/sdtdserver/setchatchannel':
    'SdtdServerController/discordBot.set-chat-channel',
  'post /api/sdtdserver/discord/chatbridge/blockedprefixes':
    'SdtdServerController/discordBot.set-chat-channel-blocked-prefixes',
  'post /api/sdtdserver/setnotificationchannel':
    'SdtdServerController/discordBot.set-notification-channel',
  'get /api/sdtdserver/discord/findChannel':
    'SdtdServerController/discordBot.find-channel-by-id',
  'get /api/sdtdserver/discord/roles':
    'SdtdServerController/discordBot.get-server-roles',

  // Custom notifications

  'post /api/sdtdserver/discord/customNotification':
    'SdtdServerController/discordBot.set-custom-notification',
  'delete /api/sdtdserver/discord/customNotification':
    'SdtdServerController/discordBot.delete-custom-notification',
  'get /api/sdtdserver/discord/customNotification':
    'SdtdServerController/discordBot.get-custom-notifications',

  // PLAYER

  'get /api/player/kick': 'Player.kick',
  'get /api/player/teleports': 'Player.get-teleports',

  'post /api/player/ban': 'Player.ban',
  'post /api/player/unban': 'Player.unban',
  'post /api/player/giveitem': 'player.give-item',
  'post /api/player/teleport': 'player.teleport',

  'delete /api/player': 'player.delete',

  'get /api/user/info': 'User.get-user-info',
  'get /api/user/ownedServers': 'User.get-owned-servers',
  'get /api/user/serversWithPermission': 'User.get-servers-with-permissions',
  'get /api/user/findguildsmanagedbyuser': 'User.find-guilds-managed-by-user',

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

  'get /api/user/steamid': 'User.find-users-by-steam-id',

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝

  'get /sdtdserver/:serverId/socket': 'SdtdServer.subscribe-to-socket'

  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝
};
