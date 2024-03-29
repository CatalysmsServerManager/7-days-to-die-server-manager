require('dotenv').config();

const sails = require('sails');
const Sentry = require('@sentry/node');

const configOverrides = {
  hookTimeout: 5000,
  hooks: {
    views: false,
    sockets: false,
    pubsub: false,
    grunt: false,
    http: false,

    cron: false,
    banneditems: false,
    customdiscordnotification: false,
    discordbot: false,
    discordchatbridge: false,
    discordnotifications: false,
    economy: false,
    historicalinfo: false,
    highpingkick: false,
    playertracking: false,
    sdtdcommands: false,
    sdtdlogs: false,
    bullboard: false,
    countryban: false,
  },
  models: {
    // never do migrations in the worker
    migrate: 'safe',
  },
};

const logProcessor = require('./processors/logs');
const notifProcessor = require('./processors/discordNotification');
const bannedItemsProcessor = require('./processors/bannedItems');
const playerTrackingProcessor = require('./processors/playerTracking');
const killProcessor = require('./processors/kill');
const hookProcessor = require('./processors/hooks');
const systemProcessor = require('./processors/system');
const customNotificationsProcessor = require('./processors/customNotifications');
const sdtdCommandsProcessor = require('./processors/sdtdCommands');

const QUEUE_LOGS_CONCURRENCY = parseInt(process.env.QUEUE_LOGS_CONCURRENCY || 100, 10);
const QUEUE_NOTIFICATIONS_CONCURRENCY = parseInt(process.env.QUEUE_NOTIFICATIONS_CONCURRENCY || 10, 10);
const QUEUE_BANNEDITEMS_CONCURRENCY = parseInt(process.env.QUEUE_BANNEDITEMS_CONCURRENCY || 10, 10);
const QUEUE_PLAYERTRACKING_CONCURRENCY = parseInt(process.env.QUEUE_PLAYERTRACKING_CONCURRENCY || 25, 10);
const QUEUE_KILL_CONCURRENCY = parseInt(process.env.QUEUE_KILL_CONCURRENCY || 10, 10);
const QUEUE_HOOK_CONCURRENCY = parseInt(process.env.QUEUE_HOOK_CONCURRENCY || 25, 10);
const QUEUE_SYSTEM_CONCURRENCY = parseInt(process.env.QUEUE_SYSTEM_CONCURRENCY || 1, 10);
const QUEUE_CUSTOMNOTIFICATIONS_CONCURRENCY = parseInt(process.env.QUEUE_CUSTOMNOTIFICATIONS_CONCURRENCY || 10, 10);
const QUEUE_SDTDCOMMANDS_CONCURRENCY = parseInt(process.env.QUEUE_SDTDCOMMANDS_CONCURRENCY || 100, 10);


sails.load(configOverrides, async function (err) {
  if (err) {
    sails.log.error(err);
    await new Promise(resolve => process.stdout.once('drain', () => resolve()));
    await new Promise(resolve => process.stderr.once('drain', () => resolve()));
    process.exit(1);
  }

  sails.log('Running bulls worker');
  Sentry.configureScope(function (scope) {
    scope.setTag('workerProcess', process.env.npm_lifecycle_event || 'worker');
  });

  const discordClient = sails.helpers.discord.getClient();
  if (process.env.DISCORDBOTTOKEN) {
    await discordClient.login(sails.config.custom.botToken);
  }

  const queues = {
    logs: sails.helpers.getQueueObject('logs'),
    discordNotifications: sails.helpers.getQueueObject('discordNotifications'),
    bannedItems: sails.helpers.getQueueObject('bannedItems'),
    playerTracking: sails.helpers.getQueueObject('playerTracking'),
    kill: sails.helpers.getQueueObject('kill'),
    hooks: sails.helpers.getQueueObject('hooks'),
    system: sails.helpers.getQueueObject('system'),
    customNotifications: sails.helpers.getQueueObject('customNotifications'),
    sdtdCommands: sails.helpers.getQueueObject('sdtdCommands'),
  };

  await Promise.all([
    // We can afford a high concurrency here since jobs are only a HTTP fetch. This would be different if they are long running, blocking operations
    queues.logs.process(QUEUE_LOGS_CONCURRENCY, sails.hooks.sentry.wrapWorkerJob(logProcessor)),
    queues.discordNotifications.process(QUEUE_NOTIFICATIONS_CONCURRENCY, sails.hooks.sentry.wrapWorkerJob(notifProcessor)),
    queues.bannedItems.process(QUEUE_BANNEDITEMS_CONCURRENCY, sails.hooks.sentry.wrapWorkerJob(bannedItemsProcessor)),
    queues.playerTracking.process(QUEUE_PLAYERTRACKING_CONCURRENCY, sails.hooks.sentry.wrapWorkerJob(playerTrackingProcessor)),
    queues.kill.process(QUEUE_KILL_CONCURRENCY, sails.hooks.sentry.wrapWorkerJob(killProcessor)),
    queues.hooks.process(QUEUE_HOOK_CONCURRENCY, sails.hooks.sentry.wrapWorkerJob(hookProcessor)),
    queues.system.process(QUEUE_SYSTEM_CONCURRENCY, sails.hooks.sentry.wrapWorkerJob(systemProcessor)),
    queues.customNotifications.process(QUEUE_CUSTOMNOTIFICATIONS_CONCURRENCY, sails.hooks.sentry.wrapWorkerJob(customNotificationsProcessor)),
    queues.sdtdCommands.process(QUEUE_SDTDCOMMANDS_CONCURRENCY, sails.hooks.sentry.wrapWorkerJob(sdtdCommandsProcessor, { sampled: true }))
  ]);

  return;
});
