var supertest = require('supertest');
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

  it('should return 200 with valid info', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/name')
      .send({
        serverId: sails.testServer.id,
        commandId: testCommand.id,
        newName: 'newName',
      })
      .expect(200);
  });

  it('should return 400 without commandId', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/name')
      .send({
        serverId: sails.testServer.id,
        newName: 'newName',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"commandId" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 without serverId', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/name')
      .send({
        newName: 'newName',
        commandId: testCommand.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body).to.eql('Error while running "manageServer" policy, could not determine server ID.');
      });
  });

  it('should return 400 without newName', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/name')
      .send({
        serverId: sails.testServer.id,
        commandId: testCommand.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"newName" is required, but it was not defined.' ]);
      });
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

  it('should return 200 with valid info', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/commandsToExecute')
      .send({
        serverId: sails.testServer.id,
        commandId: testCommand.id,
        newCommandsToExecute: 'newCommandsToExecute',
      })
      .expect(200);
  });

  it('should return 400 without commandId', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/commandsToExecute')
      .send({
        serverId: sails.testServer.id,
        newCommandsToExecute: 'newCommandsToExecute',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"commandId" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 without newCommandsToExecute', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/commandsToExecute')
      .send({
        serverId: sails.testServer.id,
        commandId: testCommand.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"newCommandsToExecute" is required, but it was not defined.' ]);
      });
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

  it('should return 200 with valid info', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/cost')
      .send({
        commandId: testCommand.id,
        newCost: 50,
        serverId: sails.testServer.id,
      })
      .expect(200);
  });

  it('should return 400 without commandId', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/cost')
      .send({
        newCost: 50,
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"commandId" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 without newCost', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/cost')
      .send({
        commandId: testCommand.id,
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"newCost" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 when newCost is not a number', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/cost')
      .send({
        commandId: testCommand.id,
        newCost: 'newCost',
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ 'Invalid "newCost":\n  · Expecting a number, but got a string.' ]);
      });
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

  it('should return 200 with valid info', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/enabled')
      .send({
        commandId: testCommand.id,
        newEnabled: true,
        serverId: sails.testServer.id,
      })
      .expect(200);
  });

  it('should return 400 without commandId', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/enabled')
      .send({
        newEnabled: true,
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"commandId" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 without newEnabled', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/enabled')
      .send({
        commandId: testCommand.id,
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"newEnabled" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 when newEnabled is not a boolean', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/enabled')
      .send({
        commandId: testCommand.id,
        newEnabled: 'newEnabled',
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ 'Invalid "newEnabled":\n  · Expecting a boolean, but got a string.' ]);
      });
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

  it('should return 200 with valid info', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/delay')
      .send({
        commandId: testCommand.id,
        newDelay: 50,
        serverId: sails.testServer.id,
      })
      .expect(200);
  });

  it('should return 400 without commandId', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/delay')
      .send({
        newDelay: 50,
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"commandId" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 without newDelay', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/delay')
      .send({
        commandId: testCommand.id,
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"newDelay" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 when newDelay is not a number', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/delay')
      .send({
        commandId: testCommand.id,
        newDelay: 'newDelay',
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ 'Invalid "newDelay":\n  · Expecting a number, but got a string.' ]);
      });
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

  it('should return 200 with valid info', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/level')
      .send({
        commandId: testCommand.id,
        newLevel: 50,
        serverId: sails.testServer.id,
      })
      .expect(200);
  });

  it('should return 400 without commandId', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/level')
      .send({
        newLevel: 50,
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"commandId" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 without newLevel', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/level')
      .send({
        commandId: testCommand.id,
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"newLevel" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 when newLevel is not a number', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/level')
      .send({
        commandId: testCommand.id,
        newLevel: 'newLevel',
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ 'Invalid "newLevel":\n  · Expecting a number, but got a string.' ]);
      });
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

  it('should return 200 with valid info', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/output')
      .send({
        commandId: testCommand.id,
        newOutput: true,
        serverId: sails.testServer.id,
      })
      .expect(200);
  });

  it('should return 400 without commandId', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/output')
      .send({
        newOutput: true,
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"commandId" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 without newOutput', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/output')
      .send({
        commandId: testCommand.id,
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"newOutput" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 when newOutput is not a boolean', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/output')
      .send({
        commandId: testCommand.id,
        newOutput: 'newOutput',
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ 'Invalid "newOutput":\n  · Expecting a boolean, but got a string.' ]);
      });
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

  it('should return 200 with valid info', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/timeout')
      .send({
        commandId: testCommand.id,
        newTimeout: 50,
        serverId: sails.testServer.id,
      })
      .expect(200);
  });

  it('should return 400 without commandId', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/timeout')
      .send({
        newTimeout: 50,
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"commandId" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 without newTimeout', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/timeout')
      .send({
        commandId: testCommand.id,
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"newTimeout" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 when newTimeout is not a number', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/timeout')
      .send({
        commandId: testCommand.id,
        newTimeout: 'newTimeout',
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ 'Invalid "newTimeout":\n  · Expecting a number, but got a string.' ]);
      });
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

  it('should return 200 with valid info', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/description')
      .send({
        serverId: sails.testServer.id,
        commandId: testCommand.id,
        description: 'description',
      })
      .expect(200);
  });

  it('should return 400 without commandId', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/description')
      .send({
        serverId: sails.testServer.id,
        description: 'description',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"commandId" is required, but it was not defined.' ]);
      });
  });

  it('should return 400 without description', function () {
    return supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/commands/custom/description')
      .send({
        serverId: sails.testServer.id,
        commandId: testCommand.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"description" is required, but it was not defined.' ]);
      });
  });
});
