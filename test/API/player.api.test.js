var supertest = require('supertest');
var agent = supertest(sails.hooks.http.app);

describe('GET /api/player/inventory @api', function () {
  it('should return JSON', function (done) {
    agent
      .get('/api/player/inventory')
      .query({
        steamId: sails.testUser.steamId,
        serverId: sails.testServer.id
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        if (_.isUndefined(response.body.inventory) || _.isUndefined(response.body.inventory.bag) || _.isUndefined(response.body.inventory.belt) || _.isUndefined(response.body.inventory.equipment)) {
          return done('Did not find inventory information')

        }
        done()
      })
  });
  it('should error when no steamId given', function (done) {
    agent
      .get('/api/player/inventory')
      .query({
        serverId: sails.testServer.id
      })
      .expect(400, done);
  });
  it('should error when no serverId given', function (done) {
    agent
      .get('/api/player/inventory')
      .query({
        steamId: sails.testUser.steamId,
      })
      .expect(400, done);
  });
});

describe('GET /api/player/ban @api', function () {
  it('should return OK (200)', function (done) {
    agent
      .get('/api/player/ban')
      .query({
        steamId: sails.testUser.steamId,
        serverId: sails.testServer.id
      })
      .expect(200, done)
  });
  it('should return JSON', function (done) {
    agent
      .get('/api/player/ban')
      .query({
        steamId: sails.testUser.steamId,
        serverId: sails.testServer.id
      })
      .expect('Content-Type', /json/, done)
  });
  it('should return info about ban status', function (done) {
    agent
      .get('/api/player/ban')
      .query({
        steamId: sails.testUser.steamId,
        serverId: sails.testServer.id
      })
      .then(response => {
        if (_.isUndefined(response.body.banned)) {
          return done('Did not find ban status information')

        }
        done()
      })
  })
  it('should error when no steamId given', function (done) {
    agent
      .get('/api/player/ban')
      .query({
        serverId: sails.testServer.id
      })
      .expect(400, done);
  });
  it('should error when no serverId given', function (done) {
    agent
      .get('/api/player/ban')
      .query({
        steamId: sails.testUser.steamId,
      })
      .expect(400, done);
  });
});
