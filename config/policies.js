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


module.exports.policies = {

  // isLoggedIn gets included in most of these because it contains the redirect logic

  sdtdServerController: {
    '*': ["isLoggedIn",'isServerOwner'],
    'add-server': 'isLoggedIn',
    'add-server-view': 'isLoggedIn',
    'view-gbl': 'isLoggedIn',
    'dashboard': ['isLoggedIn', 'roles/viewDashboard'],
    'settings' : ['isLoggedIn', 'roles/manageServer'],
  },

  gblController: {
    '*' : 'isLoggedIn',
    'set-note': ["isLoggedIn",'isServerOwner']
  },

  roleController: {
    '*': ["isLoggedIn",'roles/manageRoles'],
    'add-player': ["isLoggedIn",'roles/manageRoles'],
    'get-role': ["isLoggedIn"],
  },

  ShopController: {
    '*': ['isLoggedIn'],
    'listing-add': ["isLoggedIn",'roles/manageEconomy'],
    'listing-edit': ["isLoggedIn",'roles/manageEconomy'],
    'listing-delete': ["isLoggedIn",'roles/manageEconomy'],
    'listing-buy' : 'isLoggedIn',
    'shop-export' : ["isLoggedIn",'roles/manageEconomy'],
    'shop-import' : ["isLoggedIn",'roles/manageEconomy'],
  },

  customCommandController: {
    '*': ["isLoggedIn",'isServerOwner'],
  },

  playerController: {
    '*': ['isLoggedIn','roles/managePlayers']
  },

  userController: {
    '*': 'isLoggedIn',
    'profile': ['isLoggedIn','isLoggedInUser'],
    'dashboard': ['isLoggedIn','isLoggedInUser']
  },

  authController: {
    'discordLogin': 'isLoggedIn',
    'discordReturn': 'isLoggedIn'
  },

  sdtdTicketController: {
    'view-ticket': ["isLoggedIn", 'canSeeTicket'],
    'open-tickets': true,
    'server-tickets-view': ["isLoggedIn",'isServerOwner'],
  },

  "cron-job": {
    "*" : ["isLoggedIn",'isServerOwner']
  },

};
