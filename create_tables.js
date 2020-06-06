const dotenv = require("dotenv");
const sails = require('sails');

// disable discord bot
process.env.DISCORDBOTTOKEN = '';

const configOverrides = {
  hookTimeout: 2000,
  hooks: {
    /* This should get shared somewhere */
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
    // always do migrations!
    migrate: 'alter',
  },
};

sails.load(configOverrides, function (err) {
  sails.on('hook:orm:loaded', () => {
    console.log('done creating tables');
    process.exit(0);
  });
});

