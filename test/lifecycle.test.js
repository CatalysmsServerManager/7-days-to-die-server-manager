const path = require('path');
const sails = require('sails');
const faker = require('faker');
const MockDate = require('mockdate');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const { Sequelize } = require('sequelize');
const { config: configHelper, path: pathHelper, generic: genericHelper } = require('sequelize-cli/lib/helpers/index');
const {
  getMigrator,
  ensureCurrentMetaSchema,
} = require('sequelize-cli/lib/core/migrator');

chai.use(chaiAsPromised);
chai.use(sinonChai);

process.env.TZ = 'UTC';
process.env.IS_TEST = true;
process.env.NODE_ENV = 'test';
process.env.CSMM_DONATOR_TIER = 'patron';
delete process.env.PORT;

let sequelize = undefined;

beforeEach(function () {
  MockDate.set('2020-05-01T01:20:05+0000');
});
before(() => {
  global.sandbox = sinon.createSandbox();
  global.expect = chai.expect;
});
beforeEach(() => {
  global.sandbox.restore();
});
beforeEach(async () => {
  await clearRedis();
});
// Before running any tests...
before(async function () {
  // Increase the Mocha timeout so that Sails has enough time to lift
  this.timeout(50000);
  genericHelper.getEnvironment = () => 'test';
  configHelper.getConfigFile = () => path.resolve(__dirname, '..', 'sequelize.config.js');
  configHelper.configFileExists = () => true;
  configHelper.rawConfig = require(configHelper.getConfigFile());
  pathHelper.getPath = () => path.resolve(__dirname, '..', 'migrations');

  sequelize = new Sequelize(require(configHelper.getConfigFile()).test.url, { logging: false });
  const migrator = await getMigrator('migration');
  await ensureCurrentMetaSchema(migrator).then(() => migrator.pending());
  await migrator.up({});
  await new Promise((resolve, reject) => {
    sails.lift({
      // Your sails app's configuration files will be loaded automatically,
      // but you can also specify any other special overrides here for testing purposes.
      hookTimeout: this.timeout() - 1000,
      hooks: {
        grunt: false,

        playerTracking: false,
        discordBot: false,
        //highpingkick: false
      },
      log: { level: process.env.CSMM_LOGLEVEL || 'info' },
      security: {
        csrf: false
      },

      port: 1338,

      datastores: {
        default: {
          adapter: 'sails-mysql',
          url: process.env.TEST_DBSTRING || process.env.DBSTRING,
          charset: 'utf8mb4'
        },
        cache: {
          adapter: 'sails-redis',
        },
      }
    }, (err) => err ? reject(err) : resolve());
  });
});

// After all tests have finished...
after(function (done) {
  sails.lower(done);
});

afterEach(async function () {

  await sequelize.transaction({}, async transaction => {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction });
    const promises = [];
    for (modelName in sails.models) {
      promises.push(sequelize.query(`truncate ${sails.models[modelName].tableName}`, { transaction }));
    }
    await Promise.all(promises);
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction });
  });

});

beforeEach(async function () {
  let testUser = await User.create({
    steamId: faker.datatype.number({ min: 0, max: 9999999999999 }),
    username: faker.internet.userName(),
    discordId: '111111111111111111'
  }).meta({ skipAllLifecycleCallbacks: true }).fetch();

  let testServer = await SdtdServer.create({
    name: faker.company.companyName(),
    ip: 'localhost',
    webPort: '8082',
    authName: faker.random.alphaNumeric(20),
    authToken: faker.random.alphaNumeric(20),
    owner: testUser.id
  }).meta({ skipAllLifecycleCallbacks: true }).fetch();

  let testPlayer = await Player.create({
    steamId: testUser.steamId,
    entityId: 1,
    server: testServer.id,
    user: testUser.id,
    name: faker.internet.userName(),
    lastTeleportTime: 0
  }).meta({ skipAllLifecycleCallbacks: true }).fetch();

  let testServerConfig = await SdtdConfig.create({
    server: testServer.id,
    inactive: false,
    countryBanConfig: {
      bannedCountries: ['BE'], whiteListedSteamIds: ['76561198028175940'],
    },
    discordGuildId: 'testDiscordGuild'

  }).meta({ skipAllLifecycleCallbacks: true }).fetch();

  sails.testUser = testUser;
  sails.testServer = testServer;
  sails.testPlayer = testPlayer;
  sails.testServerConfig = testServerConfig;
  sails.testServer.players = [testPlayer];
});

function clearRedis() {
  return new Promise((resolve, reject) => {
    sails.getDatastore('cache').leaseConnection(function during(redisConnection, proceed) {
      redisConnection.flushdb((err, reply) => {
        if (err) { return proceed(err); }

        return proceed(undefined, reply);
      });
    }).exec((err, result) => {
      if (err) { return reject(err); }

      return resolve(result);
    });
  });
}
