const dotenv = require("dotenv");
const sails = require('sails');

dotenv.load();

// disable discord bot
process.env.DISCORDBOTTOKEN = '';
process.env.NODE_ENV = 'development';

const configOverrides = Object.assign({}, require('./config/env/production.js'), {
  hookTimeout: 60000,
  log: {
    level: 'error',
    custom: null,
    inspect: true
  },
  hooks: {
    /* This should get shared somewhere */
    views: false,
    sockets: false,
    pubsub: false,
    grunt: false,
    http: false,
    blueprints: false,
    router: false,

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
    // always do migrations!
    migrate: 'alter',
  },
  security: {
    csrf: false
  },
});

sails.on('hook:orm:loaded', async () => {
  console.log('done creating tables');
  process.exit(0);
});

sails.load(configOverrides, function (err) {
  if (err) { console.error(err); process.exit(1); }
});

