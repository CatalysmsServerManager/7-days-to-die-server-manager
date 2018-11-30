var supertest = require('supertest');
var expect = require("chai").expect;



describe('GET /api/stats', function () {
  it('should return an array', function () {
    return supertest(sails.hooks.http.app)
      .get('/api/stats')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body).to.be.an('array');
      });
  });
});
