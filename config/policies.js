/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/isLoggedIn.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "isLoggedIn")
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */


let policyObject = {
  // isLoggedIn gets included in most of these because it contains the redirect logic

  adminController: {
    '*': ['isCsmmAdmin']
  },

  sdtdServerController: {
    '*': ['isLoggedIn', 'roles/manageServer'],
    'get-players-view': ['isLoggedIn', 'roles/managePlayers'],
    'add-server': 'isLoggedIn',
    'add-server-view': 'isLoggedIn',
    'view-gbl': 'isLoggedIn',
    'available-items': 'isLoggedIn',
    'subscribe-to-socket': ['isLoggedIn', 'roles/hasAccess'],
    'is-online': ['isLoggedIn', 'roles/hasAccess'],
    'get-fps': ['isLoggedIn', 'roles/hasAccess'],
    'dashboard': ['isLoggedIn', 'roles/viewDashboard'],
    'settings': ['isLoggedIn', 'roles/manageServer'],
    'economy/*': ['isLoggedIn', 'roles/manageEconomy'],
    'historicalData/*': ['isLoggedIn', 'roles/viewAnalytics'],
    'view-tracking': ['isLoggedIn', 'roles/useTracking'],
    'load-land-claims': ['isLoggedIn', 'roles/useTracking'],
    'execute-command': ['isLoggedIn', 'roles/useCommands'],
    'send-message': ['isLoggedIn', 'roles/useChat'],
    'get-players': ['isLoggedIn', 'roles/hasAccess'],
    'get-players-datatable': ['isLoggedIn', 'roles/managePlayers'],
    'server-info-view': ['isLoggedIn', 'roles/hasAccess'],
    'check-donator': 'isLoggedIn',
    'server-tile': ['isLoggedIn', 'roles/viewDashboard'],
  },

  gblController: {
    '*': 'isLoggedIn',
    'set-note': ['isLoggedIn'], // Permission check is handled inside the action
    'delete-ban': ['IsLoggedIn', 'roles/manageGbl'],
  },

  roleController: {
    '*': ['isLoggedIn', 'roles/manageServer'],
    'add-player': ['isLoggedIn', 'roles/managePlayers'],
    'remove-player': ['isLoggedIn', 'roles/managePlayers'],
    'get-role': ['isLoggedIn'],
    'check-permission': ['isLoggedIn']
  },

  ShopController: {
    '*': ['isLoggedIn'],
    'listing-add': ['isLoggedIn', 'roles/manageEconomy'],
    'listing-edit': ['isLoggedIn', 'roles/manageEconomy'],
    'listing-delete': ['isLoggedIn', 'roles/manageEconomy'],
    'listing-buy': 'isLoggedIn',
    'shop-export': ['isLoggedIn', 'roles/manageEconomy'],
    'shop-import': ['isLoggedIn', 'roles/manageEconomy'],
  },

  customCommandController: {
    '*': ['isLoggedIn', 'roles/manageServer'],
  },

  playerController: {
    '*': ['isLoggedIn', 'roles/managePlayers'],
    'view-gbl': ['isLoggedIn']
  },

  userController: {
    '*': 'isLoggedIn',
    'profile': ['isLoggedIn', 'isLoggedInUser'],
    'dashboard': ['isLoggedIn', 'isLoggedInUser']
  },

  authController: {
    'discordLogin': 'isLoggedIn',
    'discordReturn': 'isLoggedIn'
  },

  sdtdTicketController: {
    '*': ['isLoggedIn', 'roles/manageTickets'],
    'view-ticket': ['isLoggedIn', 'canSeeTicket'],
    'open-tickets': true,
    'server-tickets-view': ['isLoggedIn', 'roles/manageTickets'],
    'add-comment': ['isLoggedIn', 'canSeeTicket'],
    'edit-ticket': ['isLoggedIn', 'roles/manageTickets'],
    'update-ticket-status': ['isLoggedIn', 'roles/manageTickets'],
  },

  'tracking-info': {
    '*': ['isLoggedIn', 'roles/useTracking'],
  },

  'cron-job': {
    '*': ['isLoggedIn', 'roles/manageServer']
  },

  customHookController: {
    '*': ['isLoggedIn', 'roles/manageServer'],
  },

  playgroundController: {
    '*': true,
    'get-meta': true
  },

};

module.exports.policies = policyObject;

