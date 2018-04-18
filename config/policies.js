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

  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions (`true` allows public     *
   * access)                                                                  *
   *                                                                          *
   ***************************************************************************/

  //'*': 'isLoggedIn',

  /***************************************************************************
   *                                                                          *
   * Here's an example of mapping some policies to run before a controller    *
   * and its actions                                                          *
   *                                                                          *
   ***************************************************************************/
  // UserController: {
  //
  //   // We might mandate that requests come from a logged-in user for
  //   // most actions in this controller.
  //   '*': 'isLoggedIn',
  //
  //   // But we'll let anyone access the 'login' and 'signup' actions
  //   login: true,
  //   signup: true,
  //
  //   // And we'll only let admins delete users.
  //   destroy: 'isAdmin',
  //
  // },

  sdtdServerController: {
    '*': 'isServerOwner',
    'add-server': 'isLoggedIn',
    'economy/enable-economy' : ['isPatron', 'isServerOwner'],
    'economy/disable-economy' : ['isPatron', 'isServerOwner'],
    'economy/economy-view' : ['isPatron', 'isServerOwner'],
  },

  customCommandController: {
    '*': 'isServerOwner',
  },

  playerController: {
    '*': ['isLoggedIn', 'isPlayerOwner']
  },

  userController: {
    '*': 'isLoggedIn',
    'profile': 'isLoggedInUser',
    'dashboard': 'isLoggedInUser'
  },

  authController: {
    'discordLogin': 'isLoggedIn',
    'discordReturn': 'isLoggedIn'
  },

  sdtdTicketController: {
    'view-ticket': 'canSeeTicket',
    'open-tickets': true,
    'server-tickets-view': 'isServerOwner',
  }

};
