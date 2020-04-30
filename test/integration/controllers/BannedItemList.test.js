const supertest = require('supertest');
const {expect} = require("chai");

describe('BannedItemList', function () {

  it('getting without server id should error', async function () {
    const response = await supertest(sails.hooks.http.app).get('/api/sdtdserver/bannedItems')
    expect(response.body).to.deep.equal({
      code: 'E_MISSING_OR_INVALID_PARAMS',
      problems: [ '"serverId" is required, but it was not defined.' ],
      message: 'The server could not fulfill this request (`GET /api/sdtdserver/bannedItems`) due to 1 missing or invalid parameter.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. '
    });
    expect(response.statusCode).to.equal(400);
  });

  it('getting with server id, but no items, should return fine', async function () {
    const response = await supertest(sails.hooks.http.app).get(`/api/sdtdserver/bannedItems?serverId=${sails.testServer.id}`)
    expect(response.body).to.deep.equal([]);
    expect(response.statusCode).to.equal(200);
  });

  it('should return 400 when name or commandsToExecute is not given',async function () {
    const postResponse = await supertest(sails.hooks.http.app)
      .post('/api/sdtdserver/bannedItems/item')
      .send({
        serverId: sails.testServer.id,
        bannedItem: "something",
      });
    expect(postResponse.body).to.deep.equal({});
    expect(postResponse.statusCode).to.equal(200);

    const getResponse = await supertest(sails.hooks.http.app).get(`/api/sdtdserver/bannedItems?serverId=${sails.testServer.id}`)
    expect(getResponse.body).to.deep.equal(["something"]);
    expect(getResponse.statusCode).to.equal(200);
  });
});

