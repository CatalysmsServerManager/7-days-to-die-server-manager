var supertest = require('supertest');
var expect = require('chai').expect;
let testCommand;

describe('POST /api/sdtdserver/commands/custom/name', function () {
  beforeEach(async function () {
    testCommand = await CustomCommand.create({
      server: sails.testServer.id,
      name: 'update-test',
      commandsToExecute: 'say test'
    }).fetch();
  });

  afterEach(async function () {
    await CustomCommand.destroy({
      id: testCommand.id
    });
  });

  it('should return 200 with valid info', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/name')
      .send({
        serverId: sails.testServer.id,
        commandId: testCommand.id,
        newName: 'newName',
      })
      .expect(200, done);
  });

  it('should return 400 without commandId', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/name')
      .send({
        serverId: sails.testServer.id,
        newName: 'newName',
      })
      .expect(400, done);
  });

  it('should return 400 without serverId', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/name')
      .send({
        newName: 'newName',
        commandId: testCommand.id,
      })
      .expect(400, done);
  });

  it('should return 400 without newName', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/name')
      .send({
        serverId: sails.testServer.id,
        commandId: testCommand.id,
      })
      .expect(400, done);
  });

});

describe('POST /api/sdtdserver/commands/custom/commandsToExecute', function () {
  beforeEach(async function () {
    testCommand = await CustomCommand.create({
      server: sails.testServer.id,
      name: 'update-test',
      commandsToExecute: 'say test'
    }).fetch();
  });

  afterEach(async function () {
    await CustomCommand.destroy({
      id: testCommand.id
    });
  });

  it('should return 200 with valid info', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/commandsToExecute')
      .send({
        serverId: sails.testServer.id,
        commandId: testCommand.id,
        newCommandsToExecute: 'newCommandsToExecute',
      })
      .expect(200, done);
  });

  it('should return 400 without commandId', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/commandsToExecute')
      .send({
        serverId: sails.testServer.id,
        newCommandsToExecute: 'newCommandsToExecute',
      })
      .expect(400, done);
  });

  it('should return 400 without newCommandsToExecute', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/commandsToExecute')
      .send({
        serverId: sails.testServer.id,
        commandId: testCommand.id,
      })
      .expect(400, done);
  });


});

describe('POST /api/sdtdserver/commands/custom/cost', function () {
  beforeEach(async function () {
    testCommand = await CustomCommand.create({
      server: sails.testServer.id,
      name: 'update-test',
      commandsToExecute: 'say test'
    }).fetch();
  });

  afterEach(async function () {
    await CustomCommand.destroy({
      id: testCommand.id
    });
  });

  it('should return 200 with valid info', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/cost')
      .send({
        commandId: testCommand.id,
        newCost: 50,
      })
      .expect(200, done);
  });

  it('should return 400 without commandId', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/cost')
      .send({
        newCost: 50,
      })
      .expect(400, done);
  });

  it('should return 400 without newCost', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/cost')
      .send({
        commandId: testCommand.id,
      })
      .expect(400, done);
  });

  it('should return 400 when newCost is not a number', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/cost')
      .send({
        commandId: testCommand.id,
        newCost: 'newCost',
      })
      .expect(400, done);
  });
});

describe('POST /api/sdtdserver/commands/custom/enabled', function () {
  beforeEach(async function () {
    testCommand = await CustomCommand.create({
      server: sails.testServer.id,
      name: 'update-test',
      commandsToExecute: 'say test'
    }).fetch();
  });

  afterEach(async function () {
    await CustomCommand.destroy({
      id: testCommand.id
    });
  });

  it('should return 200 with valid info', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/enabled')
      .send({
        commandId: testCommand.id,
        newEnabled: true,
      })
      .expect(200, done);
  });

  it('should return 400 without commandId', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/enabled')
      .send({
        newEnabled: true,
      })
      .expect(400, done);
  });

  it('should return 400 without newEnabled', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/enabled')
      .send({
        commandId: testCommand.id,
      })
      .expect(400, done);
  });

  it('should return 400 when newEnabled is not a boolean', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/enabled')
      .send({
        commandId: testCommand.id,
        newEnabled: 'newEnabled',
      })
      .expect(400, done);
  });
});

describe('POST /api/sdtdserver/commands/custom/delay', function () {
  beforeEach(async function () {
    testCommand = await CustomCommand.create({
      server: sails.testServer.id,
      name: 'update-test',
      commandsToExecute: 'say test'
    }).fetch();
  });

  afterEach(async function () {
    await CustomCommand.destroy({
      id: testCommand.id
    });
  });

  it('should return 200 with valid info', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/delay')
      .send({
        commandId: testCommand.id,
        newDelay: 50,
      })
      .expect(200, done);
  });

  it('should return 400 without commandId', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/delay')
      .send({
        newDelay: 50,
      })
      .expect(400, done);
  });

  it('should return 400 without newDelay', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/delay')
      .send({
        commandId: testCommand.id,
      })
      .expect(400, done);
  });

  it('should return 400 when newDelay is not a number', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/delay')
      .send({
        commandId: testCommand.id,
        newDelay: 'newDelay',
      })
      .expect(400, done);
  });
});

describe('POST /api/sdtdserver/commands/custom/level', function () {
  beforeEach(async function () {
    testCommand = await CustomCommand.create({
      server: sails.testServer.id,
      name: 'update-test',
      commandsToExecute: 'say test'
    }).fetch();
  });

  afterEach(async function () {
    await CustomCommand.destroy({
      id: testCommand.id
    });
  });

  it('should return 200 with valid info', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/level')
      .send({
        commandId: testCommand.id,
        newLevel: 50,
      })
      .expect(200, done);
  });

  it('should return 400 without commandId', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/level')
      .send({
        newLevel: 50,
      })
      .expect(400, done);
  });

  it('should return 400 without newLevel', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/level')
      .send({
        commandId: testCommand.id,
      })
      .expect(400, done);
  });

  it('should return 400 when newLevel is not a number', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/level')
      .send({
        commandId: testCommand.id,
        newLevel: 'newLevel',
      })
      .expect(400, done);
  });
});

describe('POST /api/sdtdserver/commands/custom/output', function () {
  beforeEach(async function () {
    testCommand = await CustomCommand.create({
      server: sails.testServer.id,
      name: 'update-test',
      commandsToExecute: 'say test'
    }).fetch();
  });

  afterEach(async function () {
    await CustomCommand.destroy({
      id: testCommand.id
    });
  });

  it('should return 200 with valid info', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/output')
      .send({
        commandId: testCommand.id,
        newOutput: true,
      })
      .expect(200, done);
  });

  it('should return 400 without commandId', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/output')
      .send({
        newOutput: true,
      })
      .expect(400, done);
  });

  it('should return 400 without newOutput', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/output')
      .send({
        commandId: testCommand.id,
      })
      .expect(400, done);
  });

  it('should return 400 when newOutput is not a boolean', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/output')
      .send({
        commandId: testCommand.id,
        newOutput: 'newOutput',
      })
      .expect(400, done);
  });
});

describe('POST /api/sdtdserver/commands/custom/timeout', function () {
  beforeEach(async function () {
    testCommand = await CustomCommand.create({
      server: sails.testServer.id,
      name: 'update-test',
      commandsToExecute: 'say test'
    }).fetch();
  });

  afterEach(async function () {
    await CustomCommand.destroy({
      id: testCommand.id
    });
  });

  it('should return 200 with valid info', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/timeout')
      .send({
        commandId: testCommand.id,
        newTimeout: 50,
      })
      .expect(200, done);
  });

  it('should return 400 without commandId', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/timeout')
      .send({
        newTimeout: 50,
      })
      .expect(400, done);
  });

  it('should return 400 without newTimeout', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/timeout')
      .send({
        commandId: testCommand.id,
      })
      .expect(400, done);
  });

  it('should return 400 when newTimeout is not a number', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/timeout')
      .send({
        commandId: testCommand.id,
        newTimeout: 'newTimeout',
      })
      .expect(400, done);
  });
});

describe('POST /api/sdtdserver/commands/custom/description', function () {
  beforeEach(async function () {
    testCommand = await CustomCommand.create({
      server: sails.testServer.id,
      name: 'update-test',
      commandsToExecute: 'say test'
    }).fetch();
  });

  afterEach(async function () {
    await CustomCommand.destroy({
      id: testCommand.id
    });
  });

  it('should return 200 with valid info', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/description')
      .send({
        serverId: sails.testServer.id,
        commandId: testCommand.id,
        description: 'description',
      })
      .expect(200, done);
  });

  it('should return 400 without commandId', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/description')
      .send({
        serverId: sails.testServer.id,
        description: 'description',
      })
      .expect(400, done);
  });

  it('should return 400 without description', function (done) {
    supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/commands/custom/description')
      .send({
        serverId: sails.testServer.id,
        commandId: testCommand.id,
      })
      .expect(400, done);
  });
});
