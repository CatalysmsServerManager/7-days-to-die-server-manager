var supertest = require('supertest');
var assert = require('assert');
var agent = supertest(sails.hooks.http.app);

describe('GET onlineplayers', function () {
  it('should return JSON', function (done) {
    agent
      .post('/login')
      .send({
        username: 'CSMMTesterFixture',
        password: 'something'
      })
      .expect(200)
      .then(response => {
        sails.log.warn(response)
        return agent
          .get('/api/sdtdserver/onlinePlayers')
          .query({
            serverId: sails.testServer.id
          })
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
  });
  it('should error when no serverId given', function (done) {
    agent
      .get('/api/sdtdserver/onlineplayers')
      .expect(400, done);
  });
});

describe('GET /sdtdserver/:id/players', function () {
  it('Should return JSON', function (done) {

  });
  it('Should return an array', function (done) {

  });
  it('Should error when no serverID given', function (done) {

  });
})
