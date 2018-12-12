var sails = require('sails');
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
   // log: { level: 'warn' },
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
      steamId: 'fake_id',
      username: 'test_user'
    }).fetch();

    let testServer = await SdtdServer.create({
      name: 'test server',
      ip: 'localhost',
      webPort: '8082',
      authName: 'test_authName',
      authToken: 'test_authToken',
      owner: testUser.id
    }).fetch();


    sails.testUser = testUser;
    sails.testServer = testServer;

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
