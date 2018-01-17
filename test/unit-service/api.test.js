var supertest = require('supertest');
var assert = require('assert');

describe('API @api', function () {
  describe('SdtdServer', function () {

    before(async function () {
      sails.serverWithBadWebPort = await SdtdServer.create({
        ip: process.env.CSMM_TEST_IP,
        telnetPort: process.env.CSMM_TEST_TELNETPORT,
        telnetPassword: process.env.CSMM_TEST_TELNETPW,
        webPort: '1111',
        owner: sails.testUser.id,
      }).fetch()
    })

    describe('GET /api/sdtdserver/togglelogging', function () {
      this.timeout(5000)
      it('Can start logging', function (done) {
        let loggingStatus = sails.hooks.sdtdlogs.getStatus(sails.testServer.id);
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/toggleLogging')
          .query({
            serverId: sails.testServer.id
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            assert.notEqual(loggingStatus, sails.hooks.sdtdlogs.getStatus(sails.testServer.id))
            done();
          })
          .catch((err) => {
            done(err);
          })
      })

      it('Can stop logging', function (done) {
        let loggingStatus = sails.hooks.sdtdlogs.getStatus(sails.testServer.id);
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/toggleLogging')
          .query({
            serverId: sails.testServer.id
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            assert.notEqual(loggingStatus, sails.hooks.sdtdlogs.getStatus(sails.testServer.id))
            done();
          })
          .catch((err) => {
            done(err);
          })
      });
      it('Returns "notFound" when invalid ID is given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/toggleLogging')
          .query({
            serverId: sails.testServer.id + 111
          })
          .expect(404, done)
      })
    })

    describe('GET /api/sdtdserver/players', function () {

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
            done(err);
          });
      });
      it('Should error when no serverID given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/players')
          .expect(400, done);
      });
      it('Returns badRequest when server info is invalid', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/players')
          .query({
            serverId: sails.serverWithBadWebPort.id
          })
          .expect(400, done);
      });
      it('Should error when invalid serverID given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/players')
          .query({
            serverId: sails.testServer.id + 111
          })
          .expect(404, done);

      })
    });

    describe('GET /api/sdtdserver/info', function () {
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

      it('Should not have any sensitive information', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/info')
          .query({
            serverId: sails.testServer.id
          })
          .expect(200)
          .then(response => {
            if (!_.isUndefined(response.body.telnetPort)) {
              return done(new Error('Response contains the telnet port!'));
            }
            if (!_.isUndefined(response.body.telnetPassword)) {
              return done(new Error('Response contains the telnet password!'));
            }
            if (!_.isUndefined(response.body.authName)) {
              return done(new Error('Response contains the authName!'));
            }
            if (!_.isUndefined(response.body.authToken)) {
              return done(new Error('Response contains the authToken!'));
            }
            return done();
          })
          .catch(err => {
            done(err);
          });
      });
    });

    describe('GET /api/sdtdserver/executecommand', function () {
      it('Returns ok with valid info', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/executecommand')
          .query({
            serverId: sails.testServer.id,
            command: 'help'
          })
          .expect(200, done);
      })
      it('Returns notFound with bad serverId', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/executecommand')
          .query({
            serverId: sails.testServer.id + 10,
            command: 'help'
          })
          .expect(404, done);
      })
      it('Returns badRequest with invalid command', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/executecommand')
          .query({
            serverId: sails.testServer.id,
            command: 'helperinos'
          })
          .expect(400, done);
      })
    })

    describe('GET /api/sdtdserver/sendmessage', function() {

      it('Should return OK & JSON', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/sendmessage')
          .query({
            serverId: sails.testServer.id,
            message: 'Testing'
          })
          .expect(200)
          .expect('Content-Type', /json/, done);
      });

      it('Should error when no serverID given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/sendmessage')
          .expect(400, done);
      });

      it('Returns badRequest when server info is invalid', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/sdtdserver/sendmessage')
          .query({
            serverId: sails.serverWithBadWebPort.id
          })
          .expect(400, done);
      })

      it('PMs a player when a steamId is give')

    })
  })
  describe('Player', function () {
    describe('GET /api/player/ban @api', function () {
      it('should return OK (200)', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/ban')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          })
          .expect(200, done);
      });
      it('should return JSON', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/ban')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          })
          .expect('Content-Type', /json/, done);
      });
      it('should return info about ban status', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/ban')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          })
          .then(response => {
            if (_.isUndefined(response.body.banned)) {
              return done('Did not find ban status information');
            }
            done();
          });
      });
      it('should error when no steamId given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/ban')
          .query({
            serverId: sails.testServer.id
          })
          .expect(400, done);
      });
      it('should error when no serverId given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/ban')
          .query({
            steamId: sails.testUser.steamId,
          })
          .expect(400, done);
      });
    });
    describe('GET /api/player/inventory @api', function () {
      it('should return OK (200)', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/inventory')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          })
          .expect(200, done);
      });
      it('should return JSON', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/inventory')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          })
          .expect('Content-Type', /json/, done);
      });
      it('should error when no steamId given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/inventory')
          .query({
            serverId: sails.testServer.id
          })
          .expect(400, done);
      });
      it('should error when no serverId given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/inventory')
          .query({
            steamId: sails.testUser.steamId,
          })
          .expect(400, done);
      });
    });
    describe('GET /api/player/location @api', function () {
      it('should return OK (200)', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/location')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          })
          .expect(200, done);
      });
      it('should return JSON', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/location')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          })
          .expect('Content-Type', /json/, done);
      });
      it('should return info about a players location', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/location')
          .query({
            steamId: sails.testUser.steamId,
            serverId: sails.testServer.id
          }).then(response => {
            if (_.isUndefined(response.body.location)) {
              return done('Did not find location information');
            }
            if (_.isUndefined(response.body.location.x)) {
              return done('Did not x coordinate information');
            }
            if (_.isUndefined(response.body.location.y)) {
              return done('Did not y coordinate information');
            }
            if (_.isUndefined(response.body.location.z)) {
              return done('Did not z coordinate information');
            }
            done();
          });
      });
      it('should error when no steamId given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/location')
          .query({
            serverId: sails.testServer.id
          })
          .expect(400, done);
      });
      it('should error when no serverId given', function (done) {
        supertest(sails.hooks.http.app)
          .get('/api/player/location')
          .query({
            steamId: sails.testUser.steamId,
          })
          .expect(400, done);
      });
    });

  })
})
