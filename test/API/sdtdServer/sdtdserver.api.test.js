var supertest = require('supertest');
var assert = require('assert');

describe('GET /api/sdtdserver/onlineplayers @api', function () {
  it('should return JSON', function (done) {
    supertest(sails.hooks.http.app)
      .get('/api/sdtdserver/onlinePlayers')
      .query({
        serverId: sails.testServer.id
      })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('should error when no serverId given', function (done) {
    supertest(sails.hooks.http.app)
      .get('/api/sdtdserver/onlineplayers')
      .expect(400, done);
  });
});

describe('GET /api/sdtdserver/players @api', function () {
  it('Should return JSON', function (done) {
    supertest(sails.hooks.http.app)
      .get('/api/sdtdserver/players')
      .query({
        serverId: sails.testServer.id
      })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('Should return an array', function (done) {
    supertest(sails.hooks.http.app)
      .get('/api/sdtdserver/players')
      .query({
        serverId: sails.testServer.id
      })
      .then(response => {
        assert.equal(typeof response.body, typeof new Array);
        done();
      })
      .catch(err => {
        done(err)
      })
  });
  it('Should error when no serverID given', function (done) {
    supertest(sails.hooks.http.app)
      .get('/api/sdtdserver/players')
      .expect(400, done);
  });
});

describe('GET /api/sdtdserver/info @api', function () {
  it('Should return JSON', function (done) {
    supertest(sails.hooks.http.app)
      .get('/api/sdtdserver/info')
      .query({
        serverId: sails.testServer.id
      })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('Should error when no serverID given', function (done) {
    supertest(sails.hooks.http.app)
      .get('/api/sdtdserver/info')
      .expect(400, done);
  });

  it('Should not have any sensitive information', function(done) {
    supertest(sails.hooks.http.app)
    .get('/api/sdtdserver/info')
    .query({
      serverId: sails.testServer.id
    })
    .expect(200)
    .then(response => {
        if (!_.isUndefined(response.body.telnetPort)) {
            return done(new Error("Response contains the telnet port!"))
        }
        if (!_.isUndefined(response.body.telnetPassword)) {
            return done(new Error("Response contains the telnet password!"))
        }
        if (!_.isUndefined(response.body.authName)) {
            return done(new Error("Response contains the authName!"))
        }
        if (!_.isUndefined(response.body.authToken)) {
            return done(new Error("Response contains the authToken!"))
        }
        return done()
    })
    .catch(err => {
        done(err)
    }) 
  })
})
