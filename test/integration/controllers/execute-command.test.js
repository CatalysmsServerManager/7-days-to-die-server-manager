const supertest = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');

describe('API Execute command', function () {
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('works with correct data', async function () {
    sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').resolves({ result: 'it worked yay' });
    const response = await supertest(sails.hooks.http.app).post(`/api/sdtdserver/executeCommand`)
      .send({
        serverId: sails.testServer.id,
        command: 'version',
      });
    const date = new Date();
    expect(response.body).to.deep.equal({
      msg: 'it worked yay',
      date: date.toISOString(),
      type: 'commandResponse'
    });
    expect(response.statusCode).to.equal(200);
  });

  it('Handles missing params', async function () {
    let response = await supertest(sails.hooks.http.app).post(`/api/sdtdserver/executeCommand`)
      .send({
        serverId: sails.testServer.id,
      });
    expect(response.body).to.deep.equal({
      code: 'E_MISSING_OR_INVALID_PARAMS',
      problems: ['"command" is required, but it was not defined.'],
      message: 'The server could not fulfill this request (`POST /api/sdtdserver/executeCommand`) due to 1 missing or invalid parameter.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. (Just remember, any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)'
    });
    expect(response.statusCode).to.equal(400);

    response = await supertest(sails.hooks.http.app).post(`/api/sdtdserver/executeCommand`)
      .send({
        command: 'version',
      });
    expect(response.body).to.deep.equal({
      code: 'E_MISSING_OR_INVALID_PARAMS',
      problems: ['"serverId" is required, but it was not defined.'],
      message: 'The server could not fulfill this request (`POST /api/sdtdserver/executeCommand`) due to 1 missing or invalid parameter.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. (Just remember, any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)'
    });
    expect(response.statusCode).to.equal(400);

    response = await supertest(sails.hooks.http.app).post(`/api/sdtdserver/executeCommand`)
      .send({
      });
    expect(response.body).to.deep.equal({
      code: 'E_MISSING_OR_INVALID_PARAMS',
      problems: ['"serverId" is required, but it was not defined.', '"command" is required, but it was not defined.'],
      message: 'The server could not fulfill this request (`POST /api/sdtdserver/executeCommand`) due to 2 missing or invalid parameters.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. (Just remember, any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)'
    });
    expect(response.statusCode).to.equal(400);

  });

  it('Gracefully handles unknown commands', async function () {
    sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').rejects({ message: 'Not Found' });
    const date = new Date();
    const response = await supertest(sails.hooks.http.app).post(`/api/sdtdserver/executeCommand`)
      .send({
        serverId: sails.testServer.id,
        command: 'asfsafasfsaf',
      });
    expect(response.body).to.deep.equal({
      msg: 'Error: unknown command',
      date: date.toISOString(),
      type: 'commandResponse'
    });
    expect(response.statusCode).to.equal(200);
  });

  it('Gracefully handles command errors', async function () {
    sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').rejects(new Error('bad stuff'));
    const response = await supertest(sails.hooks.http.app).post(`/api/sdtdserver/executeCommand`)
      .send({
        serverId: sails.testServer.id,
        command: 'version',
      });

    expect(response.body).to.deep.equal({});
    expect(response.statusCode).to.equal(400);
  });
});

