var supertest = require('supertest');
var assert = require('assert');
var agent = supertest(sails.hooks.http.app);

describe('GET /api/player/inventory @api', function () {
    it('should return JSON', function (done) {
      agent
        .get('/api/player/inventory')
        .query({
          playerId: sails.testPlayer.id
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
    it('should error when no playerId given', function (done) {
      agent
        .get('/api/player/inventory')
        .expect(400, done);
    });
  });