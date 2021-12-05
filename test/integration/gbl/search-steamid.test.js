var supertest = require('supertest');
var expect = require('chai').expect;
const faker = require('faker');
let testBans;


describe('GET /api/gbl/find', function () {
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
  it('should return 200 with valid info', function () {
    return supertest(sails.hooks.http.app)
      .get('/api/gbl/find')
      .query({
        steamId: sails.testPlayer.steamId,
      })
      .expect(200)
      .expect('Content-Type', /json/);
  });
  it('should return correct amount of bans for a player', function () {
    return supertest(sails.hooks.http.app)
      .get('/api/gbl/find')
      .query({
        steamId: sails.testPlayer.steamId,
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.length).to.be.eq(2);
      });
  });
  it('should error when no steamId is given', function () {
    return supertest(sails.hooks.http.app)
      .get('/api/gbl/find')
      .expect(400);
  });
});
