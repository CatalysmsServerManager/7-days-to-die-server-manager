const dotenv = require("dotenv");
const sails = require('sails');
const SdtdApi = require("7daystodie-api-wrapper");

// disable discord bot
process.env.DISCORDBOTTOKEN = '';

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

const logProcessor = require("./api/hooks/sdtdLogs/logProcessor");
sails.load(configOverrides, async function (err) {
  sails.helpers.sdtdApi = {};
  for (const func of Object.keys(SdtdApi)) {
    sails.helpers.sdtdApi[func] = SdtdApi[func];
  }
  sails.log('Running bulls worker');

  await Promise.all([
    sails.helpers.getQueueObject('logs').process(async (job) => {
      sails.log.debug('[Worker] Got a `logs` job', job.data);
      job.data.server = await SdtdServer.findOne(job.data.serverId)
      return logProcessor(job);
    }),
  ]);

  return exits.success();
});
