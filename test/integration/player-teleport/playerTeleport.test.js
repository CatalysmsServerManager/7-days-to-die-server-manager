var supertest = require('supertest');
var expect = require('chai').expect;
const faker = require('faker');
let testTeleports = [];

describe('Player teleports', function () {

  beforeEach(async function () {

    testTeleports = Array(10).fill().map(() => mockTeleport({}));
    testTeleports = await Promise.all(testTeleports);
    return testTeleports;
  });

  afterEach(async function () {
    await PlayerTeleport.destroy({
      id: testTeleports.map(r => r.id)
    });
    testTeleports.length = 0;
  });

  describe('GET /api/sdtdserver/playerteleports/', function () {
    it('should return 200 with valid data', function () {
      return supertest(sails.hooks.http.app)
        .get('/api/sdtdserver/playerteleports/')
        .query({
          serverId: sails.testServer.id,
        })
        .expect(function (res) {
          expect(res.body).to.be.an('array');
        })
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should return 400 when playerId is not given', function () {
      return supertest(sails.hooks.http.app)
        .get('/api/sdtdserver/playerteleports/')
        .expect(400);
    });
  });

  describe('POST /api/teleport', function () {
    it('should return 200 with valid data', async function () {

      let newTeleport = await mockTeleport({});
      newTeleport = _.omit(newTeleport, 'id');
      let requestOptions = newTeleport;
      requestOptions.id = testTeleports[0].id;
      const res = await supertest(sails.hooks.http.app).post('/api/teleport').send(requestOptions);
      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type']).to.include('json');

      let record = await PlayerTeleport.findOne(testTeleports[0].id);
      expect(record).to.eql(requestOptions);
    });

    it('should return 400 when id is not given', async function () {
      await supertest(sails.hooks.http.app)
        .post('/api/teleport')
        .expect(400);
    });
  });

  describe('DELETE /api/teleport', function () {
    it('should return 200 with valid data', async function () {

      return supertest(sails.hooks.http.app)
        .delete('/api/teleport')
        .query({ teleportId: testTeleports[0].id })
        .expect(async function () {
          let record = await PlayerTeleport.findOne(testTeleports[0]);
          return expect(record).to.be.eq(undefined);
        })
        .expect(200);
    });

    it('should return 400 when id is not given', function () {
      return supertest(sails.hooks.http.app)
        .delete('/api/teleport')
        .expect(400);
    });
  });

});


async function mockTeleport(options) {
  _.defaults(options, {
    name: faker.address.streetName(),
    x: faker.datatype.number({
      min: -5000,
      max: 5000
    }),
    y: faker.datatype.number({
      min: -5000,
      max: 5000
    }),
    z: faker.datatype.number({
      min: -5000,
      max: 5000
    }),
    publicEnabled: true,
    player: sails.testPlayer.id
  });
  let teleport = await PlayerTeleport.create(options).fetch();
  return teleport;
}
