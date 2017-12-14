var supertest = require('supertest');
var assert = require('assert');
var agent = supertest(sails.hooks.http.app);

describe('GET /api/sdtdserver/onlineplayers @api', function () {
  it('should return JSON', function (done) {
    agent
      .get('/api/sdtdserver/onlinePlayers')
      .query({
        serverId: sails.testServer.id
      })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('should error when no serverId given', function (done) {
    agent
      .get('/api/sdtdserver/onlineplayers')
      .expect(400, done);
  });
});

describe('GET /api/sdtdserver/players @api', function () {
  it('Should return JSON', function (done) {
    agent
      .get('/api/sdtdserver/players')
      .query({
        serverId: sails.testServer.id
      })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('Should return an array', function (done) {
    agent
      .get('/api/sdtdserver/players')
      .query({
        serverId: sails.testServer.id
      })
      .then(response => {
        assert.equal(typeof response.body, typeof new Array);
        done();
      })
  });
  it('Should error when no serverID given', function (done) {
    agent
      .get('/api/sdtdserver/players')
      .expect(400, done);
  });
})
