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

  discordFeedbackChannel: "336823516383150080",

  currentAllocs: "26",
  currentCpm: '5.15',

  donorConfig: {
    devDiscordServer: '336821518250147850',
    free: {
      memUpdateKeepDataHours: 12,
      maxTeleports: 3,
      maxServers: 1,
      maxCustomCommands: 3,
      economyKeepDataHours: 12,
      maxCronJobs: 5,
      playerTrackerKeepInventoryHours: 0,
      playerTrackerKeepLocationHours: 24,
      maxCustomNotifications: 3,
    },
    patron: {
      memUpdateKeepDataHours: 24,
      maxTeleports: 5,
      maxServers: 2,
      maxCustomCommands: 5,
      economyKeepDataHours: 24,
      maxCronJobs: 10,
      playerTrackerKeepInventoryHours: 12,
      playerTrackerKeepLocationHours: 48,
      maxCustomNotifications: 5,
    },
    donator: {
      memUpdateKeepDataHours: 72,
      maxTeleports: 10,
      maxServers: 3,
      maxCustomCommands: 10,
      economyKeepDataHours: 72,
      maxCronJobs: 20,
      playerTrackerKeepInventoryHours: 24,
      playerTrackerKeepLocationHours: 72,
      maxCustomNotifications: 10,
    },
    contributor: {
      memUpdateKeepDataHours: 120,
      maxTeleports: 25,
      maxServers: 4,
      maxCustomCommands: 20,
      economyKeepDataHours: 120,
      maxCronJobs: 50,
      playerTrackerKeepInventoryHours: 72,
      playerTrackerKeepLocationHours: 120,
      maxCustomNotifications: 25,
    },
    sponsor: {
      memUpdateKeepDataHours: 168,
      maxTeleports: 100,
      maxServers: 5,
      maxCustomCommands: 50,
      economyKeepDataHours: 168,
      maxCronJobs: 100,
      playerTrackerKeepInventoryHours: 120,
      playerTrackerKeepLocationHours: 168,
      maxCustomNotifications: 50,
    }
  },
};
