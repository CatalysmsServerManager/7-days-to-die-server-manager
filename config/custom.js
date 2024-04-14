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

  logCheckInterval: parseInt(process.env.CSMM_LOG_CHECK_INTERVAL || '3000'),
  logCheckIntervalSlowMode: 300000,
  logCount: !Number.isNaN(parseInt(process.env.CSMM_LOG_COUNT)) ? parseInt(process.env.CSMM_LOG_COUNT) : 50,

  // Discord bot config
  botOwners: process.env.DISCORDOWNERIDS ? process.env.DISCORDOWNERIDS.split(',') : [],
  botToken: process.env.DISCORDBOTTOKEN,
  botEmbedLink: `${process.env.CSMM_HOSTNAME}`,
  botEmbedTitle: 'CSMM',

  discordFeedbackChannel: '336823516383150080',

  adminSteamIds: (process.env.CSMM_ADMINS || '').split(',').map(str => str.trim()).filter(Boolean),
  restartSteamIds: (process.env.CSMM_RESTART_ADMINS || '').split(',').map(str => str.trim()).filter(Boolean),

  // How often should we gather system usage statistics in ms
  usageStatsInterval: 5000, //86400000, // 1 day

  analyticsEnabled: process.env.ANALYTICS_ENABLED === 'false' ? false : true,

  // MOD VERSIONS
  currentAllocs: '31',
  currentCpm: '9.4',

  // TRACKING

  trackingCyclesBeforeDelete: 25,

  // Economy

  economyActionsBeforeDelete: process.env.ECONOMY_ACTIONS_BEFORE_DELETE || 1000,

  // Custom hooks

  supportedHooks: ['playerConnected', 'playerDisconnected', 'chatMessage', 'playerDeath', 'playerJoined', 'playerLevel', 'zombieKilled', 'animalKilled', 'playerKilled', 'logLine', 'playerSuicide'],

  // DONORS
  donorConfig: {
    devDiscordServer: '336821518250147850',
    free: {
      memUpdateKeepDataHours: 12,
      maxTeleports: 3,
      maxServers: 1,
      maxCustomCommands: 10,
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
      maxCustomCommands: 10,
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
      maxCustomCommands: 25,
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
      maxCustomCommands: 75,
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
      maxCustomCommands: 150,
      economyKeepDataHours: 168,
      maxCronJobs: 100,
      playerTrackerKeepInventoryHours: 120,
      playerTrackerKeepLocationHours: 168,
      maxCustomNotifications: 50,
    },
    premium: {
      memUpdateKeepDataHours: 336,
      maxTeleports: 150,
      maxServers: 10,
      maxCustomCommands: 250,
      economyKeepDataHours: 168 * 2,
      maxCronJobs: 200,
      playerTrackerKeepInventoryHours: 168,
      playerTrackerKeepLocationHours: 240,
      maxCustomNotifications: 100,
    },
    enterprise: {
      memUpdateKeepDataHours: 720,
      maxTeleports: 999999999,
      maxServers: 20,
      maxCustomCommands: 999999999,
      economyKeepDataHours: 168 * 3,
      maxCronJobs: 999999999,
      playerTrackerKeepInventoryHours: 240,
      playerTrackerKeepLocationHours: 336,
      maxCustomNotifications: 999999999,
    }
  },
};
