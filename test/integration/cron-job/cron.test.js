var supertest = require('supertest');
var expect = require("chai").expect;



describe('POST /api/sdtdserver/cron', function () {

  it('should return 200 with valid info', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/cron')
      .send({
        serverId: 1,
        command: 'help',
        temporalValue: '0 */5 * * *'
      })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('should return 400 when command or temporal value is not given', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/cron')
      .send({
        serverId: 1,
        temporalValue: '0 */5 * * *'
      })
      .expect(400);

    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/cron')
      .send({
        serverId: 1,
        command: 'help',
      })
      .expect(400, done);
  });
  it('should return 400 when temporal value is invalid', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/cron')
      .send({
        serverId: 1,
        command: 'help',
        temporalValue: 'invalid'
      })
      .expect(400, done);
  });
});
