var supertest = require('supertest');
var agent = supertest(sails.hooks.http.app);

describe('GET /api/player/location @api', function () {
  it('should return OK (200)', function (done) {
    agent
      .get('/api/player/location')
      .query({
        steamId: sails.testUser.steamId,
        serverId: sails.testServer.id
      })
      .expect(200, done)
  });
  it('should return JSON', function (done) {
    agent
      .get('/api/player/location')
      .query({
        steamId: sails.testUser.steamId,
        serverId: sails.testServer.id
      })
      .expect('Content-Type', /json/, done)
  })
  it('should return info about a players location', function (done) {
    agent
      .get('/api/player/location')
      .query({
        steamId: sails.testUser.steamId,
        serverId: sails.testServer.id
      }).then(response => {
        if (_.isUndefined(response.body.location)) {
          return done('Did not find location information')
        }
        if (_.isUndefined(response.body.location.x)) {
          return done('Did not x coordinate information')
        }
        if (_.isUndefined(response.body.location.y)) {
          return done('Did not y coordinate information')
        }
        if (_.isUndefined(response.body.location.z)) {
          return done('Did not z coordinate information')
        }
        done()
      })
  })
  it('should error when no steamId given', function (done) {
    agent
      .get('/api/player/location')
      .query({
        serverId: sails.testServer.id
      })
      .expect(400, done);
  })
  it('should error when no serverId given', function (done) {
    agent
      .get('/api/player/location')
      .query({
        steamId: sails.testUser.steamId,
      })
      .expect(400, done);
  })
});
