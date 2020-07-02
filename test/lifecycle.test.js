const sails = require('sails');
const faker = require('faker');
const MockDate = require('mockdate');
const sinon = require('sinon');
const chai = require("chai");
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.use(sinonChai);

process.env.IS_TEST = true;
process.env.NODE_ENV = 'test';
process.env.CSMM_DONATOR_TIER = 'patron';
delete process.env.REDISSTRING;
delete process.env.PORT;

beforeEach(function () {
  MockDate.set('2020-05-01T01:20:05+0000');
});
before(() => {
  global.sandbox = sinon.createSandbox();
  global.expect = chai.expect;
})
beforeEach(() => {
  global.sandbox.restore()
})
beforeEach(() => {
  sails.cache = {};
});
// Before running any tests...
before(function (done) {

  async function onComplete(err) {
    if (err) {
      throw err;
    }

    let testUser = await User.create({
      steamId: faker.random.number({ min: 0, max: 9999999999999 }),
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
  }

  // Increase the Mocha timeout so that Sails has enough time to lift
  this.timeout(50000);
  sails.lift({
    // Your sails app's configuration files will be loaded automatically,
    // but you can also specify any other special overrides here for testing purposes.
    hookTimeout: this.timeout() - 1000,
    hooks: {
      grunt: false,

      playerTracking: false,
    },
    log: { level: process.env.CSMM_LOGLEVEL || 'info' },
    security: {
      csrf: false
    },

    port: 0,

    datastores: {
      default: {
        adapter: 'sails-disk',
        inMemoryOnly: true
      },
      cache: {
        adapter: 'sails-disk',
        inMemoryOnly: true
      },
      testDB: {
        adapter: 'sails-disk',
        inMemoryOnly: true
      }
    },
    models: {
      datastore: 'testDB',
    },

  }, (err) => { onComplete(err).then(done, done); });
});

// After all tests have finished...
after(function (done) {
  sails.lower(done);
});

beforeEach(function (done) {
  destroyFuncs = [];
  for (modelName in sails.models) {
    destroyFuncs.push(function (callback) {
      sails.models[modelName].destroy({})
        .exec(function (err) {
          callback(null, err)
        });
    })
  }
  async.parallel(destroyFuncs, function (err, results) {
    done(err);
  })
});
