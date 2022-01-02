const supertest = require('supertest');
const { expect } = require('chai');

describe('Cron import', function () {

  it('happy path', async function () {

    const data = `[{"command":"say Hello","temporalValue":"30 * * * *","enabled":true,"notificationEnabled":false}]`;

    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron/import')
      .send({serverId: sails.testServer.id, file: data});

    expect(response.statusCode).to.equal(200);
    const cronjobs = await CronJob.find({server: sails.testServer.id});
    expect(cronjobs).to.have.length(1);
    const expected = JSON.parse(data);
    expect(cronjobs[0].command).to.be.equal(expected[0].command);
    expect(cronjobs[0].temporalValue).to.be.equal(expected[0].temporalValue);
  });

  it('Bad temporal value', async function () {

    const data = `[{"command":"say Hello","temporalValue":"kjafaklfpka","enabled":true,"notificationEnabled":false}]`;

    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron/import')
      .send({serverId: sails.testServer.id, file: data});

    expect(response.statusCode).to.equal(400);
    expect(response.body).to.deep.equal([ 'Invalid temporal value, syntax error - Error: Validation error, cannot resolve alias "kja"' ]);
  });


  it('Too short temporal value', async function () {

    const data = `[{"command":"say Hello","temporalValue":"* * * * *","enabled":true,"notificationEnabled":false}]`;

    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron/import')
      .send({serverId: sails.testServer.id, file: data});

    expect(response.statusCode).to.equal(400);
    expect(response.body).to.deep.equal([ 'Invalid temporal value, must be 5 minutes apart * * * * *' ]);
  });

  it('Enabled not a boolean', async function () {

    const data = `[{"command":"say Hello","temporalValue":"30 * * * *","enabled": "not a boolean","notificationEnabled":false}]`;

    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron/import')
      .send({serverId: sails.testServer.id, file: data});

    expect(response.statusCode).to.equal(400);
    expect(response.body).to.deep.equal([ 'Invalid "enabled" must be true or false - not a boolean' ]);
  });


  it('notificationEnabled not a boolean', async function () {

    const data = `[{"command":"say Hello","temporalValue":"30 * * * *","enabled": true,"notificationEnabled":"not a boolean"}]`;

    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/cron/import')
      .send({serverId: sails.testServer.id, file: data});

    expect(response.statusCode).to.equal(400);
    expect(response.body).to.deep.equal([ 'Invalid "notificationEnabled" must be true or false - not a boolean' ]);
  });
});

