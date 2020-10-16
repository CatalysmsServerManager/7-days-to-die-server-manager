const sails = require('sails');
const SdtdApi = require('7daystodie-api-wrapper');
const Sentry = require('@sentry/node');

// disable discord bot
//process.env.DISCORDBOTTOKEN = '';

const configOverrides = {
  hookTimeout: 2000,
  hooks: {
    views: false,
    sockets: false,
    pubsub: false,
    grunt: false,
    http: false,

    cron: false,
    banneditems: false,
    customdiscordnotification: false,
    customhooks: false,
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
sails.load(configOverrides, async function (err) {
  if (err) {
    sails.log.error(err);
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

  await Promise.all([
    // We can afford a high concurrency here since jobs are only a HTTP fetch. This would be different if they are long running, blocking operations
    sails.helpers.getQueueObject('logs').process(100, logProcessor),
    sails.helpers.getQueueObject('discordNotifications').process(notifProcessor),
  ]);

  return;
});
