var sails = require('sails');

// Before running any tests...
before(function (done) {

  // Increase the Mocha timeout so that Sails has enough time to lift, even if you have a bunch of assets.
  this.timeout(30000);

  // Load env vars
  require('dotenv').config();

  sails.lift({
    // Your sails app's configuration files will be loaded automatically,
    // but you can also specify any other special overrides here for testing purposes.

    // For example, we might want to skip the Grunt hook,
    // and disable all logs except errors and warnings:
    hooks: {
      grunt: false
    },
    log: {
      level: 'warn'
    },
    // Clean out DB before running tests
    models: {
      migrate: 'drop'
    },
    policies: {
      sdtdServerController: {
        '*': true
      },
      playerController: {
        '*': true
      }
    },
    port: 1338
  }, async function (err) {
    if (err) {
      return done(err);
    }
    // here you can load fixtures, etc.
    // (for example, you might want to create some records in the database)

    try {
      let client = sails.hooks.discordbot.getClient();

      // Password = "something"
      var testUser = await User.create({
        username: 'CSMMTesterFixture',
        encryptedPassword: '$2a$10$b8kbwLOvUvJH3Y.37ZAwdu77K3zaFfjXAQnaym3BqpSuzDApJcbcG',
        steamId: process.env.CSMM_TEST_STEAMID
      }).fetch();

      var testServer = await sails.helpers.add7DtdServer.with({
        ip: process.env.CSMM_TEST_IP,
        telnetPort: process.env.CSMM_TEST_TELNETPORT,
        telnetPassword: process.env.CSMM_TEST_TELNETPW,
        webPort: process.env.CSMM_TEST_WEBPORT,
        owner: testUser.id,
        discordGuildId: client.channels.get(process.env.DISCORDTESTCHANNEL).guild.id
      });

      sails.testUser = testUser;
      testServer.telnetPassword = process.env.CSMM_TEST_TELNETPW
      sails.testServer = testServer
      sails.testChannel = client.channels.get(process.env.DISCORDTESTCHANNEL);

      sails.log.warn('Finished bootstrapping test data');
      return done();

    } catch (error) {
      sails.log.error(error);
      return done(error);
    }

  });
});

// After all tests have finished...
after(async function () {
  try {
    await SdtdServer.destroy({});
    await User.destroy({});
    await Player.destroy({});
    return sails.lower();
  } catch (error) {
    return error
  }




});
