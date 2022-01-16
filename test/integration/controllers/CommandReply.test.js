const supertest = require('supertest');
const { expect } = require('chai');

const makeSmallResponse = (response) => { return { ok: response.ok, body: response.body, statusCode: response.statusCode }; };

describe('CommandReply', function () {

  it('getting without server id should error', async function () {
    const response = await supertest(sails.hooks.http.mockApp).get('/api/sdtdserver/commands/reply');
    expect(response.body).to.deep.equal({
      code: 'E_MISSING_OR_INVALID_PARAMS',
      problems: [
        '"serverId" is required, but it was not defined.'
      ],
      message: 'The server could not fulfill this request (`GET /api/sdtdserver/commands/reply`) due to 1 missing or invalid parameter.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. (Just remember, any time you inject dynamic data into the HTML, be sure to escape the strings at the point of injection.)'
    });
    expect(response.statusCode).to.equal(400);
  });

  it('getting with server id, but no overrides, should return the default', async function () {
    const response = await supertest(sails.hooks.http.mockApp).get(`/api/sdtdserver/commands/reply?serverId=${sails.testServer.id}&type=notVoted`);
    expect(response.body).to.deep.equal([
      {
        'reply': 'You have not voted yet! You can vote at https://7daystodie-servers.com/server/serverIdToBeFilledByAdmin/',
        'type': 'notVoted'
      }
    ]);
    expect(response.statusCode).to.equal(200);
  });

  it('You should be able to create a command reply, and fetch it, and fetch all overrides ', async function () {
    expect(
      await supertest(sails.hooks.http.mockApp)
        .get(`/api/sdtdserver/commands/reply?serverId=${sails.testServer.id}&type=notVoted`)
        .then(makeSmallResponse)
    ).to.deep.equal({
      ok: true,
      statusCode: 200,
      body: [{
        'reply': 'You have not voted yet! You can vote at https://7daystodie-servers.com/server/serverIdToBeFilledByAdmin/',
        'type': 'notVoted'
      }]
    });

    expect(
      await supertest(sails.hooks.http.mockApp)
        .post('/api/sdtdserver/commands/reply')
        .send({
          serverId: sails.testServer.id,
          type: 'notVoted',
          reply: 'You have not voted yet! You can vote at https://vote.gov/ (not really)',
        })
        .then(makeSmallResponse)
    ).to.deep.equal({
      ok: true,
      statusCode: 200,
      body: {
        'created': true,
        'createdAt': 1588296005000,
        'id': 1,
        'reply': 'You have not voted yet! You can vote at https://vote.gov/ (not really)',
        'server': sails.testServer.id,
        'type': 'notVoted',
        'updatedAt': 1588296005000,
      }
    });

    expect(
      await supertest(sails.hooks.http.mockApp)
        .get(`/api/sdtdserver/commands/reply?serverId=${sails.testServer.id}&type=notVoted`)
        .then(makeSmallResponse)
    ).to.deep.equal({
      ok: true,
      statusCode: 200,
      body: [{
        'createdAt': 1588296005000,
        'id': 1,
        'reply': 'You have not voted yet! You can vote at https://vote.gov/ (not really)',
        'server': sails.testServer.id,
        'type': 'notVoted',
        'updatedAt': 1588296005000,
      }]
    });
    expect(
      await supertest(sails.hooks.http.mockApp)
        .get(`/api/sdtdserver/commands/reply?serverId=${sails.testServer.id}`)
        .then(makeSmallResponse)
    ).to.deep.equal({
      ok: true,
      statusCode: 200,
      body: [{
        'createdAt': 1588296005000,
        'id': 1,
        'reply': 'You have not voted yet! You can vote at https://vote.gov/ (not really)',
        'server': sails.testServer.id,
        'type': 'notVoted',
        'updatedAt': 1588296005000,
      }]
    });
  });

  it('should create a reply, then delete it', async function () {
    expect(
      await supertest(sails.hooks.http.mockApp)
        .post('/api/sdtdserver/commands/reply')
        .send({
          serverId: sails.testServer.id,
          type: 'notVoted',
          reply: 'You have not voted yet! You can vote at https://vote.gov/ (not really)',
        })
        .then(makeSmallResponse)
    ).to.deep.equal({
      ok: true,
      statusCode: 200,
      body: {
        created: true,
        'createdAt': 1588296005000,
        'id': 1,
        'reply': 'You have not voted yet! You can vote at https://vote.gov/ (not really)',
        'server': sails.testServer.id,
        'type': 'notVoted',
        'updatedAt': 1588296005000,
      }
    });

    expect(
      await supertest(sails.hooks.http.mockApp)
        .get(`/api/sdtdserver/commands/reply?serverId=${sails.testServer.id}`)
        .then(makeSmallResponse)
    ).to.deep.equal({
      ok: true,
      statusCode: 200,
      body: [{
        'createdAt': 1588296005000,
        'id': 1,
        'reply': 'You have not voted yet! You can vote at https://vote.gov/ (not really)',
        'server': sails.testServer.id,
        'type': 'notVoted',
        'updatedAt': 1588296005000,
      }]
    });

    expect(
      await supertest(sails.hooks.http.mockApp)
        .delete('/api/sdtdserver/commands/reply')
        .send({
          replyId: 1
        })
        .then(makeSmallResponse)
    ).to.deep.equal({
      ok: true,
      statusCode: 200,
      body: {}
    });

    expect(
      await supertest(sails.hooks.http.mockApp)
        .get(`/api/sdtdserver/commands/reply?serverId=${sails.testServer.id}`)
        .then(makeSmallResponse)
    ).to.deep.equal({
      ok: true,
      statusCode: 200,
      body: []
    });
  });
});

