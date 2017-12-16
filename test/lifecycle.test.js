var sails = require('sails');
var Passwords = require('machinepack-passwords');

module.exports = {
  bootstrap: async function (done) {
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
        // Password = "something"
        var testUser = await User.create({
          username: 'CSMMTesterFixture',
          encryptedPassword: "$2a$10$b8kbwLOvUvJH3Y.37ZAwdu77K3zaFfjXAQnaym3BqpSuzDApJcbcG",
          steamId: process.env.CSMM_TEST_STEAMID
        }).fetch();
        var testServer = await SdtdServer.create({
          ip: process.env.CSMM_TEST_IP,
          telnetPort: process.env.CSMM_TEST_TELNETPORT,
          telnetPassword: process.env.CSMM_TEST_TELNETPW,
          webPort: process.env.CSMM_TEST_WEBPORT,
          authName: process.env.CSMM_TEST_AUTHNAME,
          authToken: process.env.CSMM_TEST_AUTHTOKEN,
          owner: testUser.id
        }).fetch();
        sails.testUser = testUser
        sails.testServer = testServer;
        sails.log.debug('Finished bootstrapping test data');
        return done();
      } catch (error) {
        sails.log.error(error);
      }

    });
  },
  teardown: function (done) {
    // here you can clear fixtures, etc.
    // (e.g. you might want to destroy the records you created above)


    sails.lower(done);

  }
}
