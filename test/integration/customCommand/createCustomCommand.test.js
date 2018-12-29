var supertest = require('supertest');
var expect = require("chai").expect;

describe('POST /api/sdtdserver/commands/custom', function () {

  it('should return 200 with valid info', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom')
      .send({
        serverId: sails.testServer.id,
        commandName: "test-command",
        commandsToExecute: "say test"
      })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should return 400 when name or commandsToExecute is not given', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom')
      .send({
        serverId: sails.testServer.id,
        commandName: "test-command",
      })
      .expect(400);

    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom')
      .send({
        serverId: sails.testServer.id,
        commandsToExecute: "say test"
      })
      .expect(400, done);
  });

  it('should return 400 when name with spaces is given', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom')
      .send({
        serverId: sails.testServer.id,
        commandName: "test command",
        commandsToExecute: "say test"
      })
      .expect(400, done);
  });

  it('should return 400 when name that is already taken is given', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom')
      .send({
        serverId: sails.testServer.id,
        commandName: "duplicateTest",
        commandsToExecute: "say test"
      })
      .expect(200)
      .then(() => {
          supertest(sails.hooks.http.app)
          .post('/api/sdtdserver/commands/custom')
          .send({
            serverId: sails.testServer.id,
            commandName: "duplicateTest",
            commandsToExecute: "say test"
          })
          .expect(400, done);
      });

  });
});