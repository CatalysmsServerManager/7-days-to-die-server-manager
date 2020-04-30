const sails = require('sails');
const faker = require('faker');

process.env.IS_TEST = true;
process.env.NODE_ENV = 'test';
process.env.CSMM_DONATOR_TIER = 'patron';
delete process.env.REDISSTRING;

// Before running any tests...
before(function (done) {

  // Increase the Mocha timeout so that Sails has enough time to lift
  this.timeout(50000);
  require('dotenv').config();
  sails.lift({
    // Your sails app's configuration files will be loaded automatically,
    // but you can also specify any other special overrides here for testing purposes.

    hooks: {
      grunt: false
    },
    log: { level: 'warn' },
    security: {
      csrf: false
    },

    datastores: {
      testDB: {
        adapter: 'sails-disk',
        inMemoryOnly: true
      }
    },
    models: {
      connection: 'testDB',
    },

  }, async function (err) {
    if (err) {
      return done(err);
    }

    let testUser = await User.create({
      steamId: faker.random.number({min: 0, max: 9999999999999}),
      username: faker.internet.userName()
    }).fetch();

    let testServer = await SdtdServer.create({
      name: faker.company.companyName(),
      ip: 'localhost',
      webPort: '8082',
      authName: faker.random.alphaNumeric(20),
      authToken: faker.random.alphaNumeric(20),
      owner: testUser.id
    }).fetch();

    let testPlayer = await Player.create({
      steamId: testUser.steamId,
      server: testServer.id,
      user: testUser.id,
      name: faker.internet.userName(),
    }).fetch();

    let testServerConfig = await SdtdConfig.create({
      server: testServer.id,
      inactive: true
    }).fetch();


    sails.testUser = testUser;
    sails.testServer = testServer;
    sails.testPlayer = testPlayer;
    sails.testServerConfig = testServerConfig;

    return done();
  });
});

// After all tests have finished...
after(function (done) {
  sails.lower(done);
});

