require('dotenv').config();

const sails = require('sails');
const SdtdApi = require('7daystodie-api-wrapper');
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

sails.load(configOverrides, async function (err) {
  if (err) {
    sails.log.error(err);
    await new Promise(resolve => process.stdout.once('drain', () => resolve()));
    await new Promise(resolve => process.stderr.once('drain', () => resolve()));
    process.exit(1);
  }
  sails.helpers.sdtdApi = {};
  for (const func of Object.keys(SdtdApi)) {
    sails.helpers.sdtdApi[func] = SdtdApi[func];
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
    queues.logs.process(100, sails.hooks.sentry.wrapWorkerJob(logProcessor)),
    queues.discordNotifications.process(sails.hooks.sentry.wrapWorkerJob(notifProcessor)),
    queues.bannedItems.process(sails.hooks.sentry.wrapWorkerJob(bannedItemsProcessor)),
    queues.playerTracking.process(25, sails.hooks.sentry.wrapWorkerJob(playerTrackingProcessor)),
    queues.kill.process(sails.hooks.sentry.wrapWorkerJob(killProcessor)),
    queues.hooks.process(25, sails.hooks.sentry.wrapWorkerJob(hookProcessor)),
    queues.system.process(sails.hooks.sentry.wrapWorkerJob(systemProcessor)),
    queues.customNotifications.process(sails.hooks.sentry.wrapWorkerJob(customNotificationsProcessor)),
    queues.sdtdCommands.process(50, sails.hooks.sentry.wrapWorkerJob(sdtdCommandsProcessor, { sampled: true }))
  ]);

  return;
});
