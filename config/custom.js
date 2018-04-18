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

  donorConfig: {
    devDiscordServer: '336821518250147850',
    free: {
      memUpdateKeepDataHours: 12,
      maxTeleports: 3,
      maxServers: 2,
      economyKeepDataHours: 12,
    },
    patron: {
      memUpdateKeepDataHours: 12,
      maxTeleports: 3,
      maxServers: 2,
      economyKeepDataHours: 12,
    },
    donator: {
      memUpdateKeepDataHours: 72,
      maxTeleports: 10,
      maxServers: 3,
      economyKeepDataHours: 72,
    },
    contributor: {
      memUpdateKeepDataHours: 120,
      maxTeleports: 25,
      maxServers: 4,
      economyKeepDataHours: 120,
    },
    sponsor: {
      memUpdateKeepDataHours: 168,
      maxTeleports: 100,
      maxServers: 5,
      economyKeepDataHours: 168,
    }
  },
};
