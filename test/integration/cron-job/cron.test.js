var supertest = require('supertest');
var expect = require('chai').expect;
const sinon = require('sinon');

let queue;

before(() => {
  queue = sails.helpers.getQueueObject('cron');
});

describe('POST /api/sdtdserver/cron', function () {
  it('should return 200 with valid info', async function () {
    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron')
      .send({
        serverId: sails.testServer.id,
        command: 'help',
        temporalValue: '0 */6 * * *'
      });
    expect(response.statusCode).to.be.eql(200);
    expect(response.header['content-type']).to.include('json');
    expect(await queue.count()).to.be.eql(1);
  });
  it('should return 400 when command or temporal value is not given', async function () {
    await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron')
      .send({
        serverId: sails.testServer.id,
        temporalValue: '0 */6 * * *'
      })
      .expect(400);

    await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron')
      .send({
        serverId: sails.testServer.id,
        command: 'help',
      })
      .expect(400);

    expect(await queue.count()).to.be.eql(0);
  });
  it('should return 400 when temporal value is invalid', async function () {
    await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron')
      .send({
        serverId: sails.testServer.id,
        command: 'help',
        temporalValue: 'invalid'
      })
      .expect(400);

    expect(await queue.count()).to.be.eql(0);
  });
});

describe('PATCH /api/sdtdserver/cron', function () {
  it('should return 200 with valid info', async function () {
    let job = await CronJob.create({
      command: 'something else',
      temporalValue: '* * * * *',
      server: sails.testServer.id
    }).fetch();

    const response = await supertest(sails.hooks.http.mockApp)
      .patch('/api/sdtdserver/cron')
      .send({
        jobId: job.id,
        command: 'help',
        temporalValue: '0 */6 * * *',
        serverId: sails.testServer.id
      });

    expect(response.statusCode).to.equal(200);
    expect(response.header['content-type']).to.include('json');

    job = await CronJob.findOne(job.id);
    expect(job.command).to.equal('help');
    expect(job.temporalValue).to.equal('0 */6 * * *');
  });

  it('should return 400 when command or temporal value is not given', async function () {
    await supertest(sails.hooks.http.mockApp)
      .patch('/api/sdtdserver/cron')
      .send({
        jobId: 1,
        temporalValue: '0 */6 * * *',
        serverId: sails.testServer.id
      })
      .expect(400);

    await supertest(sails.hooks.http.mockApp)
      .patch('/api/sdtdserver/cron')
      .send({
        jobId: 1,
        command: 'help',
        serverId: sails.testServer.id
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql(['"temporalValue" is required, but it was not defined.']);
      });
  });

  it('should return 400 when temporal value is invalid', async function () {
    await supertest(sails.hooks.http.mockApp)
      .patch('/api/sdtdserver/cron')
      .send({
        jobId: 1,
        command: 'help',
        temporalValue: 'invalid',
        serverId: sails.testServer.id
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql(['Invalid "temporalValue":\n  · Validation error, cannot resolve alias "inv"']);
      });
  });
});

describe('GET /api/sdtdserver/cron/list', function () {

  it('should return 200 with valid info', async function () {
    await supertest(sails.hooks.http.mockApp)
      .get('/api/sdtdserver/cron/list')
      .query({
        serverId: sails.testServer.id,
      })
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('POST /api/sdtdserver/cron/notifications', function () {

  it('should return 200 with valid info', async function () {
    await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron/notifications')
      .send({
        jobId: 1,
        serverId: sails.testServer.id,
      })
      .expect(200);
  });
});

describe('DELETE /api/sdtdserver/cron/notifications', function () {

  it('should return 200 with valid info', async function () {
    await supertest(sails.hooks.http.mockApp)
      .delete('/api/sdtdserver/cron/notifications')
      .send({
        jobId: 1,
        serverId: sails.testServer.id,
      })
      .expect(200);
  });
});

describe('POST /api/sdtdserver/cron/status', function () {

  it('should return 200 with valid info', async function () {
    let job = await CronJob.create({
      command: 'something else',
      temporalValue: '* * * * *',
      server: sails.testServer.id
    }).fetch();

    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron/status')
      .send({
        jobId: job.id,
        serverId: sails.testServer.id,
      });
    expect(response.statusCode).to.equal(200);
    expect(response.header['content-type']).to.include('text/plain');
  });

  it('should return 400 when no jobId is given', async function () {
    await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron/status')
      .send({
        serverId: sails.testServer.id,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.problems).to.eql(['"jobId" is required, but it was not defined.'],);
      });
  });

});

describe('DELETE /api/sdtdserver/cron/status', function () {

  it('should return 200 with valid info', async function () {
    let job = await CronJob.create({
      command: 'something else',
      temporalValue: '* * * * *',
      server: sails.testServer.id
    }).fetch();
    const response = await supertest(sails.hooks.http.mockApp)
      .delete('/api/sdtdserver/cron/status')
      .send({
        jobId: job.id,
        serverId: sails.testServer.id,
      });
    expect(response.statusCode).to.equal(200);


  });

  it('should return 400 when no jobId is given', async function () {
    const response = await supertest(sails.hooks.http.mockApp)
      .delete('/api/sdtdserver/cron/status')
      .send({
        serverId: sails.testServer.id,
      })
      .expect((res) => {
        expect(res.body.problems).to.eql([ '"jobId" is required, but it was not defined.' ]);
      });
    expect(response.statusCode).to.equal(400);
  });
});


describe('DELETE /api/sdtdserver/cron', function () {

  it('should return 400 when no jobId is given', async function () {
    const response = await supertest(sails.hooks.http.mockApp)
      .delete('/api/sdtdserver/cron')
      .send({
        serverId: sails.testServer.id,
      }).expect((res) => {
        expect(res.body.problems).to.eql([ '"jobId" is required, but it was not defined.' ]);
      });
    expect(response.statusCode).to.equal(400);
  });

  it('should return 200 with valid info', async function () {
    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron')
      .send({
        serverId: sails.testServer.id,
        command: 'help',
        temporalValue: '0 */6 * * *'
      });
    expect(await queue.count()).to.be.eql(1);
    await supertest(sails.hooks.http.mockApp)
      .delete('/api/sdtdserver/cron')
      .send({
        jobId: response.body.id,
        serverId: sails.testServer.id,
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(await queue.count()).to.be.eql(0);
  });
});


describe('POST /api/sdtdserver/cron/test', function () {
  let mock;
  beforeEach(async () => {
    mock = sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').returns(['something']);
    sandbox.stub(sails.helpers.sdtd, 'loadPlayerData').callsFake(() => []);
    sandbox.stub(sails.helpers.sdtdApi, 'getStats').returns({});
  });

  it('should return 200 with valid info', async function () {
    let job = await CronJob.create({
      command: 'say "aaa"',
      temporalValue: '* * * * *',
      server: sails.testServer.id
    }).fetch();
    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron/test')
      .send({
        jobId: job.id,
        serverId: sails.testServer.id,
      });
    expect(response.statusCode).to.equal(200);
    expect(mock).to.have.been.calledWith(sinon.match.any, 'say "aaa"');

  });

  it('should return 200 with valid info', async function () {
    let job = await CronJob.create({
      command: 'give TestPlayer ${randList:1,2,3} 5;',
      temporalValue: '* * * * *',
      server: sails.testServer.id
    }).fetch();
    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron/test')
      .send({
        jobId: job.id,
        serverId: sails.testServer.id,
      });
    expect(response.statusCode).to.equal(200);
    expect(mock).to.have.been.calledWith(sinon.match.any, sinon.match(/give TestPlayer [1-3] 5/));

  });

});

