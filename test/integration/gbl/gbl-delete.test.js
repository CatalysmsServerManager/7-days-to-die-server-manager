var supertest = require('supertest');
var expect = require('chai').expect;
const faker = require('faker');
let testBans = [];

describe('DELETE /api/gbl/', function () {

  beforeEach(async function () {

    // testPlayer ban on testServer
    testBans = await BanEntry.createEach([{
      server: sails.testServer.id,
      steamId: sails.testPlayer.steamId,
      bannedUntil: faker.date.future().valueOf(),
      reason: 'Test ban'
    }, {
      // testPlayer ban on other server
      server: sails.testServer.id + 1,
      steamId: sails.testPlayer.steamId,
      bannedUntil: faker.date.future().valueOf(),
      reason: 'Test ban'
    },
    {
      // random player ban on testServer
      server: sails.testServer.id,
      steamId: faker.datatype.number({
        min: 0,
        max: 999999999999
      }),
      bannedUntil: faker.date.future().valueOf(),
      reason: 'Test ban'
    }
    ]).fetch();

    return;

  });

  afterEach(async function () {
    await BanEntry.destroy({
      id: testBans.map(r => r.id)
    });
    testBans.length = 0;
  });

  it('should return 200 with valid data', function () {
    return supertest(sails.hooks.http.app)
      .delete('/api/gbl/')
      .query({
        banId: testBans[0].id
      })
      .expect(200)
      .then(async () => {
        let record = await BanEntry.findOne(testBans[0].id);
        expect(record).to.be.eq(undefined);
      });
  });

  it('should return 400 when banId is not given', function () {
    return supertest(sails.hooks.http.app)
      .delete('/api/gbl/')
      .expect(400);
  });
});
