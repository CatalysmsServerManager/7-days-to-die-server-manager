require('dotenv').config();
const tracer = require('../api/utils').loadDatadog();

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
  };

  for (const queue in queues) {
    // Errors in the logs queue are handled
    // Failures are expected and do not need to be logged to Sentry
    if (queue === 'logs') {
      continue;
    }
    queues[queue].on('error', error => {
      sails.log.error(`Job with id ${job.id} in queue ${queue} has errored`, error);
      Sentry.captureException(error);
    });

    queues[queue].on('failed', (job, error) => {
      sails.log.error(`Job with id ${job.id} in queue ${queue} has errored`, error);
      Sentry.captureException(error);
    });

  }

  // Only enable tracing when DD variables are defined
  if (process.env.DD_AGENT_HOST && process.env.DD_TRACE_AGENT_PORT) {
    await Promise.all([
      // We can afford a high concurrency here since jobs are only a HTTP fetch. This would be different if they are long running, blocking operations
      queues.logs.process(100, tracer.wrap('job.logs', logProcessor)),
      queues.discordNotifications.process(tracer.wrap('job.discordNotifications', notifProcessor)),
      queues.bannedItems.process(tracer.wrap('job.bannedItems', bannedItemsProcessor)),
      queues.playerTracking.process(25, tracer.wrap('job.playerTracking', playerTrackingProcessor)),
      queues.kill.process(tracer.wrap('job.kill', killProcessor)),
      queues.hooks.process(25, tracer.wrap('job.hooks', hookProcessor)),
      queues.system.process(systemProcessor)
    ]);
  } else {
    await Promise.all([
      // We can afford a high concurrency here since jobs are only a HTTP fetch. This would be different if they are long running, blocking operations
      queues.logs.process(100, logProcessor),
      queues.discordNotifications.process(notifProcessor),
      queues.bannedItems.process(bannedItemsProcessor),
      queues.playerTracking.process(25, playerTrackingProcessor),
      queues.kill.process(killProcessor),
      queues.hooks.process(25, hookProcessor),
      queues.system.process(systemProcessor)
    ]);
  }





  return;
});
