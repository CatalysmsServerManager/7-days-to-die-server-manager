var sails = require('sails');
const faker = require('faker');

process.env.IS_TEST = true;
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
        adapter: 'sails-disk'
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
      steamId: faker.random.number(0),
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


    sails.testUser = testUser;
    sails.testServer = testServer;
    sails.testPlayer = testPlayer;

    return done();
  });
});

// After all tests have finished...
after(function (done) {
  const fs = require('fs');
  const path = require('path');

  let diskDatabaseDir = __dirname + '/../.tmp/localDiskDb';

  fs.readdir(diskDatabaseDir, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(diskDatabaseDir, file), err => {
        if (err) throw err;
      });
    }
  });

  sails.lower(done);

});
