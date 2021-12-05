var supertest = require('supertest');
var expect = require('chai').expect;
const faker = require('faker');
let testBans = [];


describe('GET /api/gbl/total', function () {
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
      steamId: faker.datatype.number({min: 0, max: 999999999999}),
      bannedUntil: faker.date.future().valueOf(),
      reason: 'Test ban'
    }]).fetch();

    return;

  });

  afterEach(async function () {
    await BanEntry.destroy({
      id: testBans.map(r => r.id)
    });
    testBans.length = 0;
  });
  it('should return a number', function () {
    return supertest(sails.hooks.http.app)
      .get('/api/gbl/total')
      .expect(200)
      .then(response => {
        expect(response.body).to.be.an('number');
        expect(response.body).to.be.eq(3);
      });
  });
});
