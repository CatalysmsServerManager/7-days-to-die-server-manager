/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */


// Load env vars
require('dotenv').config();

module.exports.custom = {

  /**************************************************************************
   *                                                                          *
   * Default settings for custom configuration used in your app.              *
   * (these may also be overridden in config/env/production.js)               *
   *                                                                          *
   ***************************************************************************/
  // mailgunDomain: 'transactional-mail.example.com',
  // mailgunApiKey: 'key-testkeyb183848139913858e8abd9a3',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',


  // Discord bot config
  botOwners: ['220554523561820160', '252369082991509514'],
  botToken: process.env.DISCORDBOTTOKEN,
  botEmbedLink: `${process.env.CSMM_HOSTNAME}`,
  botEmbedTitle: 'CSMM',

  // List of steam IDs of accepted beta testers
  betaTesters: ["76561198094989128", "76561198147774013", "76561198103284618", "76561198420509660", "76561198337138194", "76561198148564545", "76561198004732974", "76561198065906134", "76561197960396409", "76561197997630640", "76561198155971893", "76561198039685849", "76561198129279364","76561198072180284", "76561198025354070", '76561197970503522', '76561198795764006', '76561198028175941', '76561197970840634', '76561197999724620', '76561198046102521', '76561197996291089', '76561198267206692', '76561198257684623'],
};
