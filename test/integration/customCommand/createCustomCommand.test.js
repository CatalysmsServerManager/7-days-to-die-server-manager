var supertest = require('supertest');

describe('POST /api/sdtdserver/commands/custom', function () {

  it('should return 200 with valid info', async function () {
    await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom')
      .send({
        serverId: sails.testServer.id,
        commandName: 'test-command',
        commandsToExecute: 'say test'
      })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('should return 400 when name or commandsToExecute is not given', async function () {
    await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom')
      .send({
        serverId: sails.testServer.id,
        commandName: 'test-command',
      })
      .expect(400);

    await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom')
      .send({
        serverId: sails.testServer.id,
        commandsToExecute: 'say test'
      })
      .expect(400);
  });

  it('should return 400 when name with spaces is given', async function () {
    await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom')
      .send({
        serverId: sails.testServer.id,
        commandName: 'test command',
        commandsToExecute: 'say test'
      })
      .expect(400);
  });

  it('should return 400 when name that is already taken is given', async function () {
    await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom')
      .send({
        serverId: sails.testServer.id,
        commandName: 'duplicateTest',
        commandsToExecute: 'say test'
      })
      .expect(200);

    await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom')
      .send({
        serverId: sails.testServer.id,
        commandName: 'duplicateTest',
        commandsToExecute: 'say test'
      })
      .expect(400);
  });
});
